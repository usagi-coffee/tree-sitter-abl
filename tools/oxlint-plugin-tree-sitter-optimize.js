function callName(node) {
  if (node?.type !== "CallExpression") return null;
  if (node.callee.type === "Identifier") return node.callee.name;
  if (node.callee.type !== "MemberExpression" || node.callee.computed) return null;

  const object =
    node.callee.object.type === "Identifier"
      ? node.callee.object.name
      : callName({ type: "CallExpression", callee: node.callee.object });
  const property = node.callee.property.type === "Identifier" ? node.callee.property.name : null;
  return object && property ? `${object}.${property}` : null;
}

function memberName(node) {
  if (node?.type !== "MemberExpression" || node.computed) return null;
  if (node.object.type !== "Identifier" || node.object.name !== "$") return null;
  return node.property.type === "Identifier" ? node.property.name : null;
}

function ruleName(property) {
  if (property.key?.type === "Identifier") return property.key.name;
  if (property.key?.type === "Literal" && typeof property.key.value === "string") {
    return property.key.value;
  }
  return null;
}

function isRuleProperty(node) {
  return (
    node.type === "Property" &&
    ruleName(node) !== null &&
    node.value?.type === "ArrowFunctionExpression" &&
    node.value.params.some(
      (parameter) => parameter.type === "Identifier" && parameter.name === "$",
    ) &&
    isRuleMap(node.parent)
  );
}

function isRuleMap(node) {
  if (node?.type !== "ObjectExpression") return false;

  if (
    node.parent?.type === "ArrowFunctionExpression" &&
    node.parent.body === node &&
    node.parent.parent?.type === "ExportDefaultDeclaration"
  ) {
    return true;
  }

  let current = node.parent;
  while (current) {
    if (current.type === "Property" && ruleName(current) === "rules") return true;
    if (current.type === "ExportDefaultDeclaration" || current.type === "Program") break;
    current = current.parent;
  }
  return false;
}

function enclosingRule(node) {
  let current = node;
  while (current) {
    if (isRuleProperty(current)) return current;
    current = current.parent;
  }
  return null;
}

function unwrap(node) {
  let current = node;
  while (current?.type === "CallExpression") {
    const name = callName(current);
    if (!["prec", "prec.left", "prec.right", "prec.dynamic"].includes(name)) break;
    current = current.arguments.at(-1);
  }
  return current;
}

function dslSignature(node) {
  if (!node) return "?";
  if (node.type === "Literal") return JSON.stringify(node.value);
  if (node.type === "Identifier") return node.name;
  if (node.type === "MemberExpression")
    return memberName(node) ? `$.${memberName(node)}` : "member";
  if (node.type === "CallExpression") {
    return `${callName(node) ?? "call"}(${node.arguments.map(dslSignature).join(",")})`;
  }
  if (node.type === "ArrayExpression") return `[${node.elements.map(dslSignature).join(",")}]`;
  return node.type;
}

function sequenceElements(node) {
  const body = unwrap(node);
  return callName(body) === "seq" ? body.arguments : null;
}

function isNullable(node, nullableRules = new Set()) {
  const body = unwrap(node);
  const name = callName(body);
  if (name === "optional" || name === "repeat") return true;
  if (name === "repeat1") return isNullable(body.arguments[0], nullableRules);
  if (name === "seq")
    return body.arguments.every((argument) => isNullable(argument, nullableRules));
  if (name === "choice")
    return body.arguments.some((argument) => isNullable(argument, nullableRules));
  const reference = memberName(body);
  return reference !== null && nullableRules.has(reference);
}

function complexity(node) {
  if (!node) return 0;
  if (node.type === "CallExpression") {
    const weight =
      callName(node) === "choice"
        ? 3
        : ["optional", "repeat", "repeat1"].includes(callName(node))
          ? 2
          : 1;
    return weight + node.arguments.reduce((total, argument) => total + complexity(argument), 0);
  }
  if (node.type === "ArrayExpression") {
    return node.elements.reduce((total, element) => total + complexity(element), 0);
  }
  return 1;
}

function report(context, node, _optimization, message) {
  if (!enclosingRule(node)) return;
  context.report({ node, message });
}

function directiveTargetsRule(directive, ruleId) {
  const rules = directive.value
    .split("--", 1)[0]
    .split(/[\s,]+/)
    .filter(Boolean);
  return rules.length === 0 || rules.includes("all") || rules.includes(ruleId);
}

function isRuleDisabled(context, node) {
  const line = node.loc.start.line;
  let disabled = false;
  for (const directive of context.sourceCode.getDisableDirectives().directives) {
    if (!directiveTargetsRule(directive, context.id)) continue;
    const directiveLine = directive.node.loc.start.line;
    if (directive.type === "disable-next-line") {
      if (directiveLine + 1 === line) return true;
      continue;
    }
    if (directive.type === "disable-line") {
      if (directiveLine === line) return true;
      continue;
    }
    if (directiveLine > line) continue;
    if (directive.type === "disable") disabled = true;
    if (directive.type === "enable") disabled = false;
  }
  return disabled;
}

function rule(create, description) {
  return {
    meta: { type: "suggestion", docs: { description }, schema: [] },
    create,
  };
}

function collectRules(run) {
  return (context) => {
    const properties = [];
    return {
      Property(node) {
        if (isRuleProperty(node)) properties.push(node);
      },
      "Program:exit"() {
        run(context, properties);
      },
    };
  };
}

export const aliasPromotion = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || isRuleDisabled(context, property)) continue;
        if (!["seq", "choice"].includes(callName(unwrap(body))) || !isStaticDsl(body)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        let target = null;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          const alias = use.parent;
          if (!owner || owner === property || owner.parent !== property.parent) return false;
          if (memberName(use) !== name || callName(alias) !== "alias") return false;
          if (alias.arguments.length !== 2 || alias.arguments[0] !== use) return false;
          const destination = memberName(alias.arguments[1]);
          if (!destination || destination.startsWith("_")) return false;
          if (target !== null && target !== destination) return false;
          target = destination;
          for (let parent = alias.parent; parent !== owner; parent = parent.parent) {
            if (["alias", "token", "token.immediate"].includes(callName(parent))) return false;
          }
          return true;
        });
        if (!safe || properties.some((other) => ruleName(other) === target)) continue;
        if (
          (references.get(target) ?? []).some(
            (use) => callName(use.parent) !== "alias" || use.parent.arguments[1] !== use,
          )
        )
          continue;
        report(
          context,
          property,
          "alias-promotion",
          `${name} is used locally only as the named alias ${target}; try defining ${target} directly and replacing those alias calls with $.${target}. Check external references and rule-name collisions first, preserve the body and precedence, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest promoting private nonterminal rules used exclusively through one named alias");

export const phraseAliasExtraction = rule((context) => {
  const properties = [];
  const candidates = [];
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) !== "alias" || node.arguments.length !== 2) return;
      const source = memberName(node.arguments[0]);
      const target = memberName(node.arguments[1]);
      if (!source?.startsWith("_") || !source.endsWith("_phrase")) return;
      if (!target?.endsWith("_phrase") || target.startsWith("_")) return;
      const owner = enclosingRule(node);
      if (!owner) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = owner.value.body === node ? owner : node;
      if (isRuleDisabled(context, reportNode)) return;
      candidates.push({ node: reportNode, owner, source, target });
    },
    "Program:exit"() {
      const groups = new Map();
      for (const candidate of candidates) {
        const { owner, source, target } = candidate;
        const definition = properties.find(
          (property) => property.parent === owner.parent && ruleName(property) === source,
        );
        if (definition) {
          const body = unwrap(definition.value.body);
          if (!["seq", "choice"].includes(callName(body))) continue;
        }
        if (!groups.has(owner.parent)) groups.set(owner.parent, new Map());
        const aliases = groups.get(owner.parent);
        const key = `${source}:${target}`;
        const previous = aliases.get(key);
        if (!previous) {
          aliases.set(key, { reported: false });
          continue;
        }
        if (previous.reported) continue;
        previous.reported = true;
        report(
          context,
          candidate.node,
          "phrase-alias-extraction",
          `The alias of ${source} as ${target} is repeated in this rule map; try extracting or reusing a local hidden helper containing the exact alias. Confirm the source is a nonterminal phrase, preserve fields and precedence at each callsite, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest local helpers for repeated aliases of hidden nonterminal phrases");

function isSmallSequenceElement(node) {
  if (memberName(node)) return true;
  if (node?.type === "Literal") return typeof node.value === "string";
  if (callName(node) === "field") {
    return node.arguments.length === 2 && isSmallSequenceElement(node.arguments[1]);
  }
  if (callName(node) === "optional") {
    return node.arguments.length === 1 && isSmallSequenceElement(node.arguments[0]);
  }
  return false;
}

export const singleUseSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(isSmallSequenceElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        if (["alias", "field"].includes(callName(use.parent))) continue;
        let lexical = false;
        for (
          let ancestor = use.parent;
          ancestor && ancestor !== owner;
          ancestor = ancestor.parent
        ) {
          if (["token", "token.immediate"].includes(callName(ancestor))) lexical = true;
        }
        if (lexical) continue;
        report(
          context,
          property,
          "single-use-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence. Check external references, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small, locally single-use private sequences");

export const singleUseAliasSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const symbolAlias = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
    const source = memberName(node.arguments[0]);
    const target = node.arguments[1];
    if (!source || source.endsWith("_keyword")) return false;
    const destination = memberName(target);
    return destination
      ? !destination.startsWith("_") && destination !== source
      : target.type === "Literal" && typeof target.value === "string";
  };
  const smallElement = (node) => {
    if (isSmallSequenceElement(node) || isStaticKeywordCall(node) || symbolAlias(node)) return true;
    if (callName(node) === "field" && node.arguments.length === 2)
      return smallElement(node.arguments[1]);
    if (callName(node) === "optional" && node.arguments.length === 1)
      return smallElement(node.arguments[0]);
    return false;
  };
  const hasAlias = (node) => {
    if (symbolAlias(node)) return true;
    if (callName(node) === "field") return hasAlias(node.arguments[1]);
    if (callName(node) === "optional") return hasAlias(node.arguments[0]);
    return false;
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(smallElement) || !body.arguments.some(hasAlias)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-alias-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence with its symbol aliases intact. Preserve alias targets, fields and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private sequences containing symbol aliases");

function singleUseChoiceSequenceVisitor(context, fieldChoice = false) {
  const properties = [];
  const references = new Map();
  const smallElement = (node) => isSmallSequenceElement(node) || isStaticKeywordCall(node);
  const atom = (node) =>
    memberName(node) !== null ||
    (node?.type === "Literal" && typeof node.value === "string" && node.value.length > 0) ||
    isStaticKeywordCall(node);
  const alternative = (node) => {
    if (atom(node)) return true;
    if (callName(node) !== "alias" || node.arguments.length !== 2 || !atom(node.arguments[0]))
      return false;
    const target = memberName(node.arguments[1]);
    return target !== null && !target.startsWith("_");
  };
  const smallChoice = (node) => {
    if (fieldChoice) {
      if (callName(node) !== "field" || node.arguments.length !== 2) return false;
      node = node.arguments[1];
    }
    return (
      callName(node) === "choice" &&
      node.arguments.length >= 2 &&
      node.arguments.length <= 5 &&
      node.arguments.every(fieldChoice ? alternative : smallElement)
    );
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.some(smallChoice)) continue;
        if (!body.arguments.every((element) => smallElement(element) || smallChoice(element)))
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          fieldChoice ? "single-use-field-choice-sequence" : "single-use-choice-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence containing a ${fieldChoice ? "field-wrapped" : "direct"} choice. Preserve alternative order, fields${fieldChoice ? ", aliases" : ""} and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}

export const singleUseChoiceSequence = rule(
  (context) => singleUseChoiceSequenceVisitor(context),
  "Suggest inlining single-use private sequences containing small direct choices",
);

export const singleUseFieldChoiceSequence = rule(
  (context) => singleUseChoiceSequenceVisitor(context, true),
  "Suggest inlining single-use private sequences containing small field-wrapped choices",
);

export const singleUseOptionalSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const smallElement = (node) => isSmallSequenceElement(node) || isStaticKeywordCall(node);
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        const prefix = body.arguments.slice(0, -1);
        if (!prefix.every(smallElement) || prefix.every((element) => isNullable(element))) continue;
        const optionalTail = body.arguments.at(-1);
        if (callName(optionalTail) !== "optional" || optionalTail.arguments.length !== 1) continue;
        const tail = optionalTail.arguments[0];
        if (callName(tail) !== "seq" || tail.arguments.length < 2 || tail.arguments.length > 4)
          continue;
        if (!tail.arguments.every(smallElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-optional-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence with its optional compound suffix intact. Preserve fields and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private sequences ending in a small optional sequence");

export const singleUseKeywordSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const smallElement = (node) => {
    if (isSmallSequenceElement(node) || isStaticKeywordCall(node)) return true;
    if (callName(node) === "optional" && node.arguments.length === 1)
      return smallElement(node.arguments[0]);
    if (callName(node) === "field" && node.arguments.length === 2)
      return smallElement(node.arguments[1]);
    return false;
  };
  const hasKeyword = (node) => {
    if (isStaticKeywordCall(node)) return true;
    if (callName(node) === "optional") return hasKeyword(node.arguments[0]);
    if (callName(node) === "field") return hasKeyword(node.arguments[1]);
    return false;
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(smallElement) || !body.arguments.some(hasKeyword)) continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-keyword-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small keyword sequence. Preserve keyword options, fields and ordering; check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small single-use private sequences containing static kw calls");

export const singleUsePrecedenceClause = rule((context) => {
  const properties = [];
  const references = new Map();
  const staticPrecedence = ["prec", "prec.left", "prec.right"];
  const hasDynamicPrecedence = (node) =>
    callName(node) === "prec.dynamic" ||
    (node?.type === "CallExpression" && node.arguments.some(hasDynamicPrecedence));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !staticPrecedence.includes(callName(body)))
          continue;
        if (!isStaticDsl(body) || hasDynamicPrecedence(body) || complexity(body) > 24) continue;
        const sequence = unwrap(body);
        if (
          callName(sequence) !== "seq" ||
          sequence.arguments.length < 2 ||
          sequence.arguments.length > 3
        )
          continue;
        if (!isKeyword(sequence.arguments[0]) || !hasField(sequence)) continue;
        if (sequence.arguments.every(isSmallSequenceElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-precedence-clause",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small precedence-wrapped valued clause. Retain associativity and fields, preserve the helper's precedence relationships, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private valued clauses with static precedence wrappers");

export const singleUsePrecedence = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        let body = property.value.body;
        if (!["prec", "prec.left", "prec.right"].includes(callName(body))) continue;
        if (!isStaticDsl(body) || isRuleDisabled(context, property)) continue;
        while (["prec", "prec.left", "prec.right"].includes(callName(body))) {
          body = body.arguments.at(-1);
        }
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(isSmallSequenceElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-precedence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining the entire precedence-wrapped sequence, retaining every precedence and associativity wrapper. Check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small single-use private sequences with static precedence wrappers");

export const fieldChoiceForwardingRule = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property)) continue;
        let body = property.value.body;
        if (callName(body) === "seq" && body.arguments.length === 1) body = body.arguments[0];
        if (callName(body) !== "field" || body.arguments.length !== 2) continue;
        const [label, choice] = body.arguments;
        if (label.type !== "Literal" || typeof label.value !== "string") continue;
        if (
          callName(choice) !== "choice" ||
          choice.arguments.length < 2 ||
          choice.arguments.length > 5
        )
          continue;
        const targets = choice.arguments.map(memberName);
        if (targets.some((target) => !target || target === name || target.endsWith("_keyword")))
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner.parent !== property.parent
          )
            return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (
              ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
                callName(parent),
              )
            )
              return false;
          }
          return true;
        });
        if (!safe) continue;
        report(
          context,
          property,
          "field-choice-forwarding-rule",
          `${name} only applies field ${JSON.stringify(label.value)} to a choice of symbols; try replacing its local uses with the exact field/choice body and removing the private helper. Preserve alternative order, field scope and the helper's precedence relationships; check external references, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining private field wrappers around small choices of symbols");

export const fieldForwardingRule = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property)) continue;
        let body = property.value.body;
        if (callName(body) === "seq" && body.arguments.length === 1) body = body.arguments[0];
        if (callName(body) !== "field" || body.arguments.length !== 2) continue;
        const label = body.arguments[0];
        const target = memberName(body.arguments[1]);
        if (label.type !== "Literal" || typeof label.value !== "string") continue;
        if (!target || target === name || target.endsWith("_keyword")) continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner.parent !== property.parent
          )
            return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (
              ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
                callName(parent),
              )
            )
              return false;
          }
          return true;
        });
        if (!safe) continue;
        report(
          context,
          property,
          "field-forwarding-rule",
          `${name} only applies field ${JSON.stringify(label.value)} to ${target}; try replacing its local uses with the exact field wrapper and removing the private helper. Check external references and grammar metadata, preserve field scope and precedence, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining private helpers that only apply a field to a symbol");

export const forwardingRule = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const target = memberName(property.value.body);
        if (!name.startsWith("__") || !target || target === name) continue;
        const uses = references.get(name) ?? [];
        if (isRuleDisabled(context, property)) continue;
        const safeUses = uses.every((use) => {
          const owner = enclosingRule(use);
          if (!owner || owner === property || owner.parent !== property.parent) return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (["token", "token.immediate"].includes(callName(parent))) return false;
            if (
              callName(parent) === "alias" &&
              (parent.arguments[1] === use || !target.startsWith("_"))
            )
              return false;
          }
          return true;
        });
        if (!safeUses) continue;
        report(
          context,
          property,
          "forwarding-rule",
          `${name} only forwards to ${target}; try replacing its references with the target and removing the private rule. Check external uses, inline/supertype declarations, precedence and conflicts first; measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring removal of private rules that only forward to another symbol");

const preferRecursion = rule(
  (context) => ({
    CallExpression(node) {
      if (!["repeat", "repeat1"].includes(callName(node))) return;
      report(
        context,
        node,
        "recurse",
        `Try replacing ${callName(node)}() with a recursive helper.`,
      );
    },
  }),
  "Suggest measuring recursive helpers in place of repeat and repeat1",
);

const repeatedBodies = new Map();
const recursiveBodies = new Map();
const sharedSequences = new Map();
const choiceCandidates = [];
const sequenceCandidates = [];
const keywordCandidates = [];
const sharedChoices = new Map();
const sharedStatementAliases = new Map();
const sharedExpressionAliases = new Map();
const sharedItemAliases = new Map();

export function resetSharingCandidates() {
  repeatedBodies.clear();
  recursiveBodies.clear();
  sharedSequences.clear();
  choiceCandidates.length = 0;
  sequenceCandidates.length = 0;
  keywordCandidates.length = 0;
  sharedChoices.clear();
  sharedStatementAliases.clear();
  sharedExpressionAliases.clear();
  sharedItemAliases.clear();
}

function sharedNamedAliasVisitor(context, kind = "statement") {
  const properties = [];
  const candidates = [];
  const expression = kind === "expression";
  const item = kind === "item";
  const aliases = item
    ? sharedItemAliases
    : expression
      ? sharedExpressionAliases
      : sharedStatementAliases;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) !== "alias" || node.arguments.length !== 2) return;
      const source = memberName(node.arguments[0]);
      const target = memberName(node.arguments[1]);
      if (item) {
        if (!source?.startsWith("_") || source.startsWith("__") || !target?.endsWith("_item"))
          return;
        if (
          source.endsWith("_keyword") ||
          source.endsWith("_token") ||
          source.endsWith("_phrase") ||
          source.endsWith("_expression")
        )
          return;
      } else if (expression) {
        if (!source?.endsWith("_expression") || source.startsWith("__")) return;
      } else if (!source?.endsWith("_statement") || source.startsWith("_")) return;
      if (!target || target.startsWith("_") || source === target) return;
      const owner = enclosingRule(node);
      if (!owner) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = owner.value.body === node ? owner : node;
      if (isRuleDisabled(context, reportNode)) return;
      candidates.push({ node, reportNode, owner, source, target });
    },
    "Program:exit"() {
      for (const { node, reportNode, owner, source, target } of candidates) {
        const definition = properties.find((property) => ruleName(property) === source);
        if (
          definition &&
          !["seq", "choice", "repeat1"].includes(callName(unwrap(definition.value.body)))
        )
          continue;
        const key = JSON.stringify([context.cwd, source, target]);
        const candidate = {
          filename: context.filename,
          rule: ruleName(owner),
          start: context.sourceCode.getRange(node)[0],
          line: node.loc.start.line,
        };
        const previous = aliases.get(key);
        if (!previous) {
          aliases.set(key, candidate);
          continue;
        }
        if (previous.filename === candidate.filename && previous.start === candidate.start)
          continue;
        const location = `${previous.filename.split(/[\\/]/).at(-1)}:${previous.line}`;
        report(
          context,
          reportNode,
          `shared-${kind}-alias`,
          `This alias of ${source} as ${target} duplicates ${previous.rule} in ${location}; try sharing one hidden helper containing the exact alias. ${item ? "Confirm the source is a nonterminal item rule and check grammar metadata. " : expression ? "Confirm the source is a nonterminal expression and check grammar metadata. " : ""}Preserve named nodes, fields and precedence; measure parser size and validate trees.`,
        );
      }
    },
  };
}

export const sharedStatementAlias = rule(
  (context) => sharedNamedAliasVisitor(context),
  "Suggest sharing identical named aliases of public statement rules",
);

export const sharedExpressionAlias = rule(
  (context) => sharedNamedAliasVisitor(context, "expression"),
  "Suggest sharing identical named aliases of shared or public expression rules",
);

export const sharedItemAlias = rule(
  (context) => sharedNamedAliasVisitor(context, "item"),
  "Suggest sharing identical named item aliases of shared nonterminal rules",
);

function containsAlternatives(outer, inner) {
  return (
    outer.length > inner.length &&
    outer.some((_, index) =>
      inner.every((signature, offset) => outer[index + offset] === signature),
    )
  );
}

export const choiceSubset = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 2) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = property.value.body === node ? property : node;
      if (isRuleDisabled(context, reportNode)) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        rule: ruleName(property),
        line: node.loc.start.line,
        helper: property.value.body === node && ruleName(property).startsWith("_"),
        alternatives: node.arguments.map((argument) =>
          JSON.stringify(
            context.sourceCode.getTokens(argument).map(({ type, value }) => [type, value]),
          ),
        ),
        references: node.arguments.map(memberName).filter(Boolean),
      };
      for (const previous of choiceCandidates) {
        if (previous.cwd !== candidate.cwd) continue;
        if (previous.filename === candidate.filename && previous.rule === candidate.rule) continue;
        let helper, target;
        if (
          previous.helper &&
          containsAlternatives(candidate.alternatives, previous.alternatives)
        ) {
          helper = previous;
          target = candidate;
        } else if (
          candidate.helper &&
          containsAlternatives(previous.alternatives, candidate.alternatives)
        ) {
          helper = candidate;
          target = previous;
        } else continue;
        // Avoid obvious self-recursion and already-factored dispatchers.
        if (helper.references.includes(target.rule) || target.references.includes(helper.rule))
          continue;
        const other = previous.filename.split(/[\\/]/).at(-1);
        const sharing =
          helper.rule.startsWith("__") && helper.filename !== target.filename
            ? "promote the private choice to a shared helper before reuse"
            : "reuse the hidden choice";
        report(
          context,
          reportNode,
          "choice-subset",
          `${helper.rule} matches ${helper.alternatives.length} consecutive alternatives in ${target.rule} (other choice: ${other}:${previous.line}); try to ${sharing} while preserving alternative order and precedence.`,
        );
        break;
      }
      choiceCandidates.push(candidate);
    },
  }),
  "Suggest reusing existing hidden choices inside larger choices with matching consecutive alternatives",
);

function isStaticKeywordCall(node) {
  if (callName(node) !== "kw" || node.arguments.length < 1 || node.arguments.length > 2)
    return false;
  if (node.arguments[0].type !== "Literal" || typeof node.arguments[0].value !== "string")
    return false;
  const options = node.arguments[1];
  return (
    !options ||
    (options.type === "ObjectExpression" &&
      options.properties.every(
        (property) =>
          property.type === "Property" &&
          !property.computed &&
          !property.shorthand &&
          property.value.type === "Literal" &&
          ["string", "number"].includes(typeof property.value.value),
      ))
  );
}

export const keywordReuse = rule(
  (context) => ({
    CallExpression(node) {
      if (!isStaticKeywordCall(node)) return;
      const property = enclosingRule(node);
      if (!property) return;
      const wholeBody = property.value.body === node;
      if (wholeBody && !ruleName(property).startsWith("_")) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
        if (callName(parent) === "alias" && parent.arguments[0] !== node) return;
      }
      const reportNode = wholeBody ? property : node;
      if (isRuleDisabled(context, reportNode)) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        rule: ruleName(property),
        line: node.loc.start.line,
        helper: wholeBody,
        signature: JSON.stringify(
          context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
        ),
        keyword: node.arguments[0].value,
      };
      for (const previous of keywordCandidates) {
        if (previous.cwd !== candidate.cwd || previous.signature !== candidate.signature) continue;
        if (previous.helper === candidate.helper) continue;
        if (previous.filename === candidate.filename && previous.rule === candidate.rule) continue;
        const helper = previous.helper ? previous : candidate;
        const target = previous.helper ? candidate : previous;
        const sharing =
          helper.rule.startsWith("__") && helper.filename !== target.filename
            ? "promote the private keyword helper before reuse"
            : "reuse the hidden keyword helper";
        report(
          context,
          reportNode,
          "keyword-reuse",
          `${target.rule} repeats the exact ${JSON.stringify(candidate.keyword)} keyword call from ${helper.rule} (other occurrence: ${previous.filename}:${previous.line}); try to ${sharing}. Check helper-specific precedence/conflicts, then measure parser size and validate trees.`,
        );
      }
      keywordCandidates.push(candidate);
    },
  }),
  "Suggest measured reuse of existing hidden helpers for identical static keyword calls",
);

function isStaticDsl(node) {
  if (memberName(node)) return true;
  if (node?.type === "Literal") {
    return ["string", "number"].includes(typeof node.value) || Boolean(node.regex);
  }
  const name = callName(node);
  if (name === "kw") return isStaticKeywordCall(node);
  return (
    [
      "seq",
      "choice",
      "optional",
      "repeat",
      "repeat1",
      "field",
      "alias",
      "prec",
      "prec.left",
      "prec.right",
      "prec.dynamic",
      "token",
      "token.immediate",
    ].includes(name) && node.arguments.every(isStaticDsl)
  );
}

export const sharedChoice = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 2 || !isStaticDsl(node)) return;
      if (isNullable(node)) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      let subject = node;
      while (
        ["prec", "prec.left", "prec.right", "prec.dynamic"].includes(callName(subject.parent)) &&
        subject.parent.arguments.at(-1) === subject
      )
        subject = subject.parent;
      if (!isStaticDsl(subject)) return;
      const reportNode = subject === property.value.body ? property : subject;
      if (isRuleDisabled(context, reportNode)) return;
      if (referencedSymbols(subject).includes(ruleName(property))) return;
      const signature = JSON.stringify([
        context.cwd,
        context.sourceCode.getTokens(subject).map(({ type, value }) => [type, value]),
      ]);
      const candidate = {
        filename: context.filename,
        rule: ruleName(property),
        line: subject.loc.start.line,
        helper: subject === property.value.body && ruleName(property).startsWith("_"),
      };
      const previous = sharedChoices.get(signature);
      if (!previous) {
        sharedChoices.set(signature, candidate);
        return;
      }
      if (previous.filename === candidate.filename && previous.rule === candidate.rule) return;
      const helper = previous.helper ? previous : candidate.helper ? candidate : null;
      const target = helper === candidate ? previous : candidate;
      const suggestion = !helper
        ? "extract a shared hidden choice helper"
        : helper.rule.startsWith("__") && helper.filename !== target.filename
          ? `promote private ${helper.rule} to a shared helper before reuse`
          : `reuse hidden choice ${helper.rule}`;
      report(
        context,
        reportNode,
        "shared-choice",
        `This choice repeats ${node.arguments.length} alternatives from ${previous.rule} in ${previous.filename}:${previous.line}; try to ${suggestion}. Preserve fields, aliases, order, and precedence; measure parser size and validate trees.`,
      );
      if (!previous.helper && candidate.helper) sharedChoices.set(signature, candidate);
    },
  }),
  "Suggest sharing identical non-nullable choices, including small cross-file alternative sets",
);

export const recursiveTailReuse = rule(
  collectRules((context, properties) => {
    const signature = (node) =>
      JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
    for (const head of properties) {
      const headName = ruleName(head);
      const body = head.value.body;
      if (!headName.startsWith("_") || callName(body) !== "seq" || body.arguments.length < 2)
        continue;
      if (isRuleDisabled(context, head)) continue;
      const last = body.arguments.at(-1);
      if (callName(last) !== "optional" || last.arguments.length !== 1) continue;
      const tailName = memberName(last.arguments[0]);
      if (!tailName?.startsWith("_") || tailName === headName) continue;
      if (body.arguments.slice(0, -1).every((element) => isNullable(element))) continue;
      const tail = properties.find(
        (property) => property.parent === head.parent && ruleName(property) === tailName,
      );
      if (!tail || callName(tail.value.body) !== "seq" || isRuleDisabled(context, tail)) continue;
      const elements = tail.value.body.arguments;
      if (elements.length <= body.arguments.length) continue;
      const suffix = elements.slice(-body.arguments.length);
      if (
        !body.arguments.every((element, index) => signature(element) === signature(suffix[index]))
      )
        continue;
      report(
        context,
        tail,
        "recursive-tail-reuse",
        `${tailName} repeats the body of ${headName} after its separator. Try replacing that suffix with $.${headName}, keeping the separator unchanged; measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest folding duplicated item/optional-tail bodies into their existing hidden list head",
);

export const recursiveBodyReuse = rule((context) => {
  const properties = [];
  const candidates = [];
  const staticPrecedence = ["prec", "prec.left", "prec.right"];
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (!["seq", ...staticPrecedence].includes(callName(node))) return;
      const owner = enclosingRule(node);
      if (!owner || owner.value.body === node || !isStaticDsl(node)) return;
      if (staticPrecedence.includes(callName(node.parent))) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          return;
      }
      if (isRuleDisabled(context, node)) return;
      candidates.push({ node, owner, signature: signature(node) });
    },
    "Program:exit"() {
      const helpers = [];
      for (const property of properties) {
        const name = ruleName(property);
        if (!name.startsWith("_") || isRuleDisabled(context, property)) continue;
        let body = property.value.body;
        if (!isStaticDsl(body)) continue;
        while (staticPrecedence.includes(callName(body))) body = body.arguments.at(-1);
        if (callName(body) !== "seq" || body.arguments.length < 2) continue;
        const last = body.arguments.at(-1);
        if (
          callName(last) !== "optional" ||
          last.arguments.length !== 1 ||
          memberName(last.arguments[0]) !== name
        )
          continue;
        const prefix = body.arguments.slice(0, -1);
        if (prefix.every((element) => isNullable(element))) continue;
        if (prefix.some((element) => referencedSymbols(element).includes(name))) continue;
        helpers.push({ property, name, signature: signature(property.value.body) });
      }
      for (const candidate of candidates) {
        const helper = helpers.find(
          (helper) =>
            helper.property !== candidate.owner &&
            helper.property.parent === candidate.owner.parent &&
            helper.signature === candidate.signature,
        );
        if (!helper) continue;
        report(
          context,
          candidate.node,
          "recursive-body-reuse",
          `This expression repeats the complete recursive body of ${helper.name}; try replacing it with $.${helper.name}. Preserve fields, aliases and precedence, check helper-specific conflicts, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest reusing hidden recursive helpers where their complete body is expanded inside another rule");

function listHeadExtractionVisitor(context, optionalHead = false) {
  const properties = [];
  const sequences = [];
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, node)) return;
      if (
        optionalHead &&
        (callName(node.parent) !== "optional" || node.parent.arguments.length !== 1)
      )
        return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          [
            "alias",
            "token",
            "token.immediate",
            "prec",
            "prec.left",
            "prec.right",
            "prec.dynamic",
          ].includes(callName(parent))
        )
          return;
      }
      sequences.push({ node, owner, signatures: node.arguments.map(signature) });
    },
    "Program:exit"() {
      const nullable = (node) => {
        const body = unwrap(node);
        const name = callName(body);
        if (name === "field") return nullable(body.arguments[1]);
        if (name === "alias" || name === "repeat1") return nullable(body.arguments[0]);
        if (name === "seq") return body.arguments.every(nullable);
        if (name === "choice") return body.arguments.some(nullable);
        return isNullable(body);
      };
      const tails = [];
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("_") || callName(body) !== "seq" || body.arguments.length < 3)
          continue;
        if (!isStaticDsl(body) || isRuleDisabled(context, property)) continue;
        let separator = body.arguments[0];
        if (callName(separator) === "optional" && separator.arguments.length === 1)
          separator = separator.arguments[0];
        if (separator.type !== "Literal" || separator.value !== ",") continue;
        const last = body.arguments.at(-1);
        if (
          callName(last) !== "optional" ||
          last.arguments.length !== 1 ||
          memberName(last.arguments[0]) !== name
        )
          continue;
        const items = body.arguments.slice(1, -1);
        if (items.every(nullable) || items.some((item) => referencedSymbols(item).includes(name)))
          continue;
        tails.push({ property, name, suffix: body.arguments.slice(1).map(signature) });
      }
      for (const sequence of sequences) {
        for (const tail of tails) {
          if (sequence.owner === tail.property || sequence.owner.parent !== tail.property.parent)
            continue;
          if (
            optionalHead
              ? sequence.signatures.length !== tail.suffix.length
              : sequence.signatures.length <= tail.suffix.length
          )
            continue;
          const matches = sequence.signatures.some((_, index) =>
            tail.suffix.every((part, offset) => sequence.signatures[index + offset] === part),
          );
          if (!matches) continue;
          report(
            context,
            sequence.node,
            optionalHead ? "optional-list-head-extraction" : "list-head-extraction",
            optionalHead
              ? `This optional list head repeats the item and continuation in ${tail.name}; try extracting a hidden non-empty head and reusing it inside this optional and after the comma in ${tail.name}. Preserve separator optionality, fields, aliases and order; check helper-specific conflicts and precedence, then measure parser size and validate trees.`
              : `This sequence embeds the item and optional continuation repeated by ${tail.name}; try extracting that non-empty list head and reusing it here and after the comma in ${tail.name}. Preserve separator optionality, fields, aliases and order; measure parser size and validate trees.`,
          );
          break;
        }
      }
    },
  };
}

export const listHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context),
  "Suggest extracting embedded list heads shared with recursive comma tails",
);

export const optionalListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, true),
  "Suggest extracting optional list heads duplicated in recursive comma tails",
);

function referencedSymbols(node) {
  const name = memberName(node);
  if (name) return [name];
  return node?.type === "CallExpression" ? node.arguments.flatMap(referencedSymbols) : [];
}

export const sequenceSubset = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 2) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = property.value.body === node ? property : node;
      if (isRuleDisabled(context, reportNode)) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        rule: ruleName(property),
        line: node.loc.start.line,
        helper: property.value.body === node && ruleName(property).startsWith("_"),
        elements: node.arguments.map((argument) =>
          JSON.stringify(
            context.sourceCode.getTokens(argument).map(({ type, value }) => [type, value]),
          ),
        ),
        references: referencedSymbols(node),
      };
      for (const previous of sequenceCandidates) {
        if (previous.cwd !== candidate.cwd) continue;
        if (previous.filename === candidate.filename && previous.rule === candidate.rule) continue;
        let helper, target;
        if (previous.helper && containsAlternatives(candidate.elements, previous.elements)) {
          helper = previous;
          target = candidate;
        } else if (
          candidate.helper &&
          containsAlternatives(previous.elements, candidate.elements)
        ) {
          helper = candidate;
          target = previous;
        } else continue;
        if (helper.references.includes(target.rule) || target.references.includes(helper.rule))
          continue;
        const sharing =
          helper.rule.startsWith("__") && helper.filename !== target.filename
            ? "promote the private sequence to a shared helper before reuse"
            : "reuse the hidden sequence";
        report(
          context,
          reportNode,
          "sequence-subset",
          `${helper.rule} matches ${helper.elements.length} consecutive elements in ${target.rule} (other sequence: ${previous.filename}:${previous.line}); try to ${sharing}. Preserve fields, aliases, and precedence; measure parser size and validate trees.`,
        );
      }
      sequenceCandidates.push(candidate);
    },
  }),
  "Suggest reusing existing hidden sequences embedded in longer sequences",
);

export const sharedRepetition = rule(
  (context) => ({
    CallExpression(node) {
      const repetition = callName(node);
      if (!["repeat", "repeat1"].includes(repetition)) return;
      if (complexity(node.arguments[0]) < 8) return;

      const property = enclosingRule(node);
      if (!property) return;
      if (isRuleDisabled(context, node)) return;

      const candidate = {
        filename: context.filename,
        rule: ruleName(property),
      };
      const signature = dslSignature(node);
      const previous = repeatedBodies.get(signature);
      if (!previous) {
        repeatedBodies.set(signature, candidate);
        return;
      }

      if (previous.filename === candidate.filename && previous.rule === candidate.rule) return;
      const previousFile = previous.filename.split(/[\\/]/).at(-1);
      report(
        context,
        node,
        "shared-repetition",
        `This non-trivial repetition duplicates ${previous.rule} in ${previousFile}; try extracting a shared hidden helper.`,
      );
    },
  }),
  "Suggest sharing identical non-trivial repetitions across grammar rules",
);

export const sharedRecursion = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      if (!name.startsWith("_")) continue;
      if (isRuleDisabled(context, property)) continue;
      const elements = sequenceElements(property.value.body);
      if (!elements || elements.length < 2) continue;
      const tail = elements.at(-1);
      if (callName(tail) !== "optional") continue;
      const content = tail.arguments[0];
      const self = callName(content) === "seq" ? content.arguments.at(-1) : content;
      if (memberName(self) !== name) continue;

      // Normalize only the recursive edge. Token signatures keep fields, aliases,
      // keyword options, regexes, and precedence intact while ignoring comments.
      const selfStart = context.sourceCode.getRange(self.property)[0];
      const signature = JSON.stringify(
        context.sourceCode
          .getTokens(property.value.body)
          .map((token) =>
            context.sourceCode.getRange(token)[0] === selfStart
              ? ["self"]
              : [token.type, token.value],
          ),
      );
      const candidate = { filename: context.filename, rule: name };
      const previous = recursiveBodies.get(signature);
      if (!previous) {
        recursiveBodies.set(signature, candidate);
        continue;
      }
      if (previous.filename === candidate.filename && previous.rule === name) continue;
      const previousFile = previous.filename.split(/[\\/]/).at(-1);
      report(
        context,
        property,
        "shared-recursion",
        `This recursive rule duplicates ${previous.rule} in ${previousFile}; try sharing one hidden helper while preserving fields, aliases, and precedence.`,
      );
    }
  }),
  "Suggest sharing identical hidden recursive lists and tails",
);

function hasField(node) {
  return (
    callName(node) === "field" || (node?.type === "CallExpression" && node.arguments.some(hasField))
  );
}

function isKeyword(node) {
  if (callName(node) === "kw") return Boolean(node.arguments[0]?.value);
  if (memberName(node)?.endsWith("_keyword")) return true;
  if (node?.type === "Literal")
    return typeof node.value === "string" && /^[A-Za-z]/.test(node.value);
  if (callName(node) === "choice")
    return node.arguments.length > 0 && node.arguments.every(isKeyword);
  if (callName(node) === "alias") return isKeyword(node.arguments[0]);
  return false;
}

export const sharedSequence = rule((context) => {
  const sequences = [];
  const aliases = new Map();
  const unaliasedReferences = new Set();
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 2) return;
      if (!isKeyword(node.arguments[0]) || !hasField(node)) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      let subject = node;
      while (
        ["prec", "prec.left", "prec.right", "prec.dynamic"].includes(callName(subject.parent)) &&
        subject.parent.arguments.at(-1) === subject
      )
        subject = subject.parent;
      sequences.push({ subject, property });
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name?.startsWith("_") || !enclosingRule(node)) return;
      const parent = node.parent;
      const target =
        callName(parent) === "alias" && parent.arguments[0] === node
          ? memberName(parent.arguments[1])
          : null;
      if (target === null || target.startsWith("_")) {
        unaliasedReferences.add(name);
        return;
      }
      if (!aliases.has(name)) aliases.set(name, new Set());
      aliases.get(name).add(target);
    },
    "Program:exit"() {
      for (const { subject, property } of sequences) {
        const reportNode = subject === property.value.body ? property : subject;
        if (isRuleDisabled(context, reportNode)) continue;
        const name = ruleName(property);
        const targets = aliases.get(name);
        const publicAlias =
          subject === property.value.body &&
          name.startsWith("_") &&
          targets?.size === 1 &&
          !unaliasedReferences.has(name)
            ? [...targets][0]
            : null;
        // Keep token identities, keyword options, fields, aliases, and precedence
        // in the comparison; comments and whitespace have no effect.
        const signature = JSON.stringify([
          context.cwd,
          context.sourceCode.getTokens(subject).map(({ type, value }) => [type, value]),
        ]);
        const candidate = {
          filename: context.filename,
          rule: name,
          start: context.sourceCode.getRange(subject)[0],
          line: subject.loc.start.line,
          publicAlias,
        };
        const previous = sharedSequences.get(signature);
        if (!previous) {
          sharedSequences.set(signature, candidate);
          continue;
        }
        if (previous.filename === candidate.filename && previous.start === candidate.start)
          continue;
        const previousFile = `${previous.filename.split(/[\\/]/).at(-1)}:${previous.line}`;
        const message =
          publicAlias && publicAlias === previous.publicAlias
            ? `This hidden rule and ${previous.rule} in ${previousFile} have identical bodies and alias to ${publicAlias}; try sharing the public rule while preserving its tree shape.`
            : `This keyword/value sequence duplicates ${previous.rule} in ${previousFile}; try sharing a hidden helper while preserving fields, aliases, and precedence.`;
        report(context, reportNode, "shared-sequence", message);
      }
    },
  };
}, "Suggest sharing repeated keyword/value sequences, including nested clauses and aliased rules");

const alternativeExtraction = rule((context) => {
  const choices = new Map();
  return {
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 3) return;
      const signature = dslSignature(node);
      if (choices.has(signature)) {
        report(
          context,
          node,
          "alternative-extraction",
          "This non-trivial choice is duplicated; try extracting a local hidden helper.",
        );
      } else {
        choices.set(signature, node);
      }
    },
  };
}, "Suggest extracting duplicated local alternatives");

export const singleUseChoice = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 5 ||
          !isStaticDsl(body)
        )
          continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-choice",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this choice while preserving its alternatives, fields and precedence. Check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small, locally single-use private choices");

function commonEdge(left, right, fromEnd = false) {
  const limit = Math.min(left.length, right.length);
  let count = 0;
  while (count < limit) {
    const leftNode = left[fromEnd ? left.length - count - 1 : count];
    const rightNode = right[fromEnd ? right.length - count - 1 : count];
    if (dslSignature(leftNode) !== dslSignature(rightNode)) break;
    count += 1;
  }
  return count;
}

function sharedEdgeRule({ optimization, fromEnd, minimum, message, filter = () => true }) {
  return rule(
    collectRules((context, properties) => {
      const sequences = properties
        .map((property) => ({ property, elements: sequenceElements(property.value.body) }))
        .filter(({ elements }) => elements?.length > minimum);
      const reported = new Set();
      for (let right = 1; right < sequences.length; right += 1) {
        for (let left = 0; left < right; left += 1) {
          const count = commonEdge(sequences[left].elements, sequences[right].elements, fromEnd);
          if (count < minimum || !filter(sequences[right].elements, count)) continue;
          if (!reported.has(sequences[right].property)) {
            report(
              context,
              sequences[right].property,
              optimization,
              `${message} It shares ${count} elements with ${ruleName(sequences[left].property)}.`,
            );
            reported.add(sequences[right].property);
          }
        }
      }
    }),
    message,
  );
}

const prefixExtraction = sharedEdgeRule({
  optimization: "prefix-extraction",
  fromEnd: false,
  minimum: 3,
  message: "Try extracting the shared rule prefix",
});

const tailExtraction = sharedEdgeRule({
  optimization: "tail-extraction",
  fromEnd: true,
  minimum: 2,
  message: "Try extracting the shared rule tail",
});

const localPrefixHelper = sharedEdgeRule({
  optimization: "local-prefix-helper",
  fromEnd: false,
  minimum: 2,
  message: "Try extracting a local prefix-family helper",
  filter(elements, count) {
    return elements.slice(0, count).every((element) => callName(element) === "kw");
  },
});

const bodyExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const body = unwrap(property.value.body);
      if (complexity(body) < 28 || sequenceElements(body)?.length < 7) continue;
      report(
        context,
        property,
        "body-extraction",
        "This rule body is structurally expensive; try extracting a dedicated hidden body helper.",
      );
    }
  }),
  "Suggest extracting complex rule bodies",
);

const chunkExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const elements = sequenceElements(property.value.body);
      if (!elements || elements.length < 12) continue;
      const complexElements = elements.filter((element) => complexity(element) >= 4);
      if (complexElements.length < 2) continue;
      report(
        context,
        property,
        "chunk-extraction",
        "This long sequence has multiple complex sections; try extracting semantic chunks.",
      );
    }
  }),
  "Suggest extracting semantic chunks from long sequences",
);

const optionalBodyExtraction = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 3) return;
      const tail = node.arguments.at(-1);
      const body = node.arguments.at(-2);
      if (callName(body) !== "optional" || memberName(tail) !== "_terminator") return;
      report(
        context,
        node,
        "optional-body-extraction",
        "Try extracting the optional body and terminator into a hidden helper.",
      );
    },
  }),
  "Suggest extracting optional-body and terminator tails",
);

const nonEmptyTailExtraction = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 3) return;
      let nullableTail = 0;
      for (let index = node.arguments.length - 1; index >= 0; index -= 1) {
        if (!isNullable(node.arguments[index])) break;
        nullableTail += 1;
      }
      if (nullableTail < 2) return;
      report(
        context,
        node,
        "non-empty-tail-extraction",
        "Try reformulating this nullable suffix as an optional non-empty tail helper.",
      );
    },
  }),
  "Suggest non-empty helper formulations for nullable tails",
);

const tokenPacking = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "choice") return;
      const literals = node.arguments.filter(
        (argument) => argument.type === "Literal" && typeof argument.value === "string",
      );
      if (literals.length < 6) return;
      if (!literals.every(({ value }) => /^[^\p{L}\p{N}_]+$/u.test(value))) return;
      report(
        context,
        node,
        "token-packing",
        "Try packing this punctuation/operator family into a token(choice(...)) helper.",
      );
    },
  }),
  "Suggest token packing for large punctuation choices",
);

const broadDispatcher = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      const body = unwrap(property.value.body);
      if (!name.startsWith("_") || callName(body) !== "choice" || body.arguments.length < 8)
        continue;
      if (!body.arguments.every((argument) => memberName(argument)?.startsWith("_"))) continue;
      report(
        context,
        property,
        "broad-dispatcher",
        "This broad hidden dispatcher may add specialization; measure local sharing before grouping it.",
      );
    }
  }),
  "Warn about broad hidden dispatchers",
);

export default {
  meta: { name: "tree-sitter-optimize" },
  rules: {
    "shared-item-alias": sharedItemAlias,
    "shared-expression-alias": sharedExpressionAlias,
    "single-use-field-choice-sequence": singleUseFieldChoiceSequence,
    "optional-list-head-extraction": optionalListHeadExtraction,
    "single-use-precedence-clause": singleUsePrecedenceClause,
    "field-choice-forwarding-rule": fieldChoiceForwardingRule,
    "field-forwarding-rule": fieldForwardingRule,
    "single-use-alias-sequence": singleUseAliasSequence,
    "single-use-choice-sequence": singleUseChoiceSequence,
    "single-use-optional-sequence": singleUseOptionalSequence,
    "shared-statement-alias": sharedStatementAlias,
    "alias-promotion": aliasPromotion,
    "phrase-alias-extraction": phraseAliasExtraction,
    "alternative-extraction": alternativeExtraction,
    "body-extraction": bodyExtraction,
    "broad-dispatcher": broadDispatcher,
    "chunk-extraction": chunkExtraction,
    "choice-subset": choiceSubset,
    "local-prefix-helper": localPrefixHelper,
    "non-empty-tail-extraction": nonEmptyTailExtraction,
    "optional-body-extraction": optionalBodyExtraction,
    "prefix-extraction": prefixExtraction,
    "single-use-choice": singleUseChoice,
    recurse: preferRecursion,
    "shared-sequence": sharedSequence,
    "shared-recursion": sharedRecursion,
    "shared-repetition": sharedRepetition,
    "single-use-sequence": singleUseSequence,
    "single-use-keyword-sequence": singleUseKeywordSequence,
    "single-use-precedence": singleUsePrecedence,
    "forwarding-rule": forwardingRule,
    "sequence-subset": sequenceSubset,
    "recursive-tail-reuse": recursiveTailReuse,
    "recursive-body-reuse": recursiveBodyReuse,
    "list-head-extraction": listHeadExtraction,
    "keyword-reuse": keywordReuse,
    "shared-choice": sharedChoice,
    "tail-extraction": tailExtraction,
    "token-packing": tokenPacking,
  },
};
