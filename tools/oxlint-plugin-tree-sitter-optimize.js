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

export const nullableSlotList = rule((context) => {
  const properties = [],
    references = new Map();
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
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
        node.property.type === "Literal"
          ? node.property.value
          : null);
      if (typeof name !== "string") return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "choice" || body.arguments.length !== 2 || !isStaticDsl(body))
          continue;
        const [nonempty, emptyFirst] = body.arguments;
        if (
          callName(nonempty) !== "seq" ||
          nonempty.arguments.length !== 2 ||
          !memberName(nonempty.arguments[0])
        )
          continue;
        const repeat = nonempty.arguments[1];
        if (
          callName(repeat) !== "repeat" ||
          repeat.arguments.length !== 1 ||
          callName(emptyFirst) !== "repeat1" ||
          emptyFirst.arguments.length !== 1
        )
          continue;
        const slot = repeat.arguments[0];
        if (
          signature(slot) !== signature(emptyFirst.arguments[0]) ||
          callName(slot) !== "seq" ||
          slot.arguments.length !== 2
        )
          continue;
        const [separator, item] = slot.arguments;
        if (
          separator.type !== "Literal" ||
          separator.value !== "," ||
          callName(item) !== "optional" ||
          item.arguments.length !== 1 ||
          signature(item.arguments[0]) !== signature(nonempty.arguments[0])
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1 || memberName(uses[0]) !== name) continue;
        const use = uses[0],
          owner = enclosingRule(use),
          optional = use.parent;
        if (
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          isRuleDisabled(context, owner)
        )
          continue;
        if (
          callName(optional) !== "optional" ||
          optional.arguments.length !== 1 ||
          callName(optional.parent) !== "seq"
        )
          continue;
        if (isRuleDisabled(context, optional)) continue;
        let unsafe = false;
        for (let parent = optional.parent; parent !== owner; parent = parent.parent) {
          if (
            [
              "field",
              "alias",
              "token",
              "token.immediate",
              "prec",
              "prec.left",
              "prec.right",
              "prec.dynamic",
            ].includes(callName(parent))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "nullable-slot-list",
          `${name} distinguishes present and omitted first items but is itself optional; try expanding the call site into an optional first item followed by the existing repeated comma-and-optional-item slot. Preserve omitted and trailing slots, item trees and separator tokens, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest simplifying optional lists that explicitly support omitted positional items");

export const recursiveContinuationInline = rule((context) => {
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
        node.property.type === "Literal"
          ? node.property.value
          : null);
      if (typeof name !== "string") return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        let separator = body.arguments[0];
        if (callName(separator) === "optional" && separator.arguments.length === 1)
          separator = separator.arguments[0];
        if (separator.type !== "Literal" || separator.value !== ",") continue;
        const headName = memberName(body.arguments[1]);
        const head = properties.find(
          (candidate) => candidate.parent === property.parent && ruleName(candidate) === headName,
        );
        if (
          !head ||
          head === property ||
          !headName.startsWith("_") ||
          isRuleDisabled(context, head)
        )
          continue;
        const sequence = head.value.body;
        if (callName(sequence) !== "seq" || sequence.arguments.length < 2 || !isStaticDsl(sequence))
          continue;
        const continuation = sequence.arguments.at(-1);
        if (
          callName(continuation) !== "optional" ||
          continuation.arguments.length !== 1 ||
          memberName(continuation.arguments[0]) !== name
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1 || uses[0] !== continuation.arguments[0]) continue;
        if (isRuleDisabled(context, continuation)) continue;
        report(
          context,
          property,
          "recursive-continuation-inline",
          `${name} only adds a separator before recursing into ${headName}; try inlining this continuation inside the head's optional tail. Keep separator optionality, fields and list order intact, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use separator helpers in mutually recursive hidden lists");

export const sharedValuedFragment = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          parent.type === "CallExpression" &&
          !["seq", "choice", "optional", "repeat", "repeat1"].includes(callName(parent))
        )
          return;
      }
      for (let index = 0; index < node.arguments.length - 1; index++) {
        const [keyword, value] = node.arguments.slice(index, index + 2);
        if (!isStaticKeywordCall(keyword)) continue;
        if (
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string"
        )
          continue;
        const symbol = memberName(value.arguments[1]);
        if (
          !symbol ||
          symbol.startsWith("__") ||
          [keyword, value].some((part) => isRuleDisabled(context, part))
        )
          continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature: JSON.stringify(
            [keyword, value].map((part) =>
              context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
            ),
          ),
        };
        const previous = sharedValuedFragments.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous)
          report(
            context,
            keyword,
            "shared-valued-fragment",
            `This valued ${value.arguments[0].value} fragment repeats ${previous.owner} (${previous.filename}); try sharing this exact keyword and field in a hidden helper. Keep surrounding syntax, fields, keyword options and token identity intact, check visibility and precedence, then measure parser size and validate trees.`,
          );
        else sharedValuedFragments.push(candidate);
      }
    },
  }),
  "Suggest sharing exact keyword-and-field fragments embedded in longer sequences",
);

export const sharedDelimiterFieldPrefix = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      const pairs = { "(": ")", "[": "]", "{": "}" };
      for (let index = 0; index < node.arguments.length - 2; index++) {
        const [open, value, close] = node.arguments.slice(index, index + 3);
        if (
          open.type !== "Literal" ||
          close.type !== "Literal" ||
          !Object.hasOwn(pairs, open.value) ||
          pairs[open.value] !== close.value
        )
          continue;
        if (
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string"
        )
          continue;
        const symbol = memberName(value.arguments[1]);
        if (
          !symbol ||
          symbol.startsWith("__") ||
          [open, value, close].some((part) => isRuleDisabled(context, part))
        )
          continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature: JSON.stringify(
            [open, value, close].map((part) =>
              context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
            ),
          ),
        };
        const previous = sharedDelimiterFieldPrefixes.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous)
          report(
            context,
            open,
            "shared-delimiter-field-prefix",
            `This delimited ${value.arguments[0].value} field repeats a fragment in ${previous.owner} (${previous.filename}); try sharing only the opening delimiter and field in a hidden prefix helper, keeping the closing delimiter at each caller. Preserve optionality, fields and token identity, check visibility and precedence, then measure parser size and validate trees.`,
          );
        else sharedDelimiterFieldPrefixes.push(candidate);
      }
    },
  }),
  "Suggest sharing opening delimiters and fields while retaining closing delimiters at call sites",
);

export const sharedAssignmentClause = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length !== 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      const [left, operator, right] = node.arguments;
      if (
        callName(left) !== "field" ||
        left.arguments.length !== 2 ||
        left.arguments[0].type !== "Literal" ||
        typeof left.arguments[0].value !== "string"
      )
        return;
      const target = memberName(left.arguments[1]),
        source = memberName(right);
      if (
        !target ||
        target.startsWith("__") ||
        operator.type !== "Literal" ||
        operator.value !== "="
      )
        return;
      if (
        !isStaticKeywordCall(right) &&
        !(source && !source.startsWith("__")) &&
        !(right.type === "Literal" && typeof right.value === "string")
      )
        return;
      if (node.arguments.some((part) => isRuleDisabled(context, part))) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        owner: ruleName(owner),
        map: context.sourceCode.getRange(owner.parent)[0],
        signature: JSON.stringify(
          context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
        ),
      };
      const previous = sharedAssignmentClauses.find(
        (other) =>
          other.cwd === candidate.cwd &&
          other.signature === candidate.signature &&
          (other.filename !== candidate.filename ||
            (other.map === candidate.map && other.owner !== candidate.owner)),
      );
      if (previous)
        report(
          context,
          node,
          "shared-assignment-clause",
          `This ${left.arguments[0].value} assignment clause repeats ${previous.owner} (${previous.filename}); try sharing the complete field, equals sign and right-hand value in a hidden helper. Keep optionality at each caller, preserve fields and token identity, check visibility and precedence, then measure parser bytes and counts and validate trees.`,
        );
      else sharedAssignmentClauses.push(candidate);
    },
  }),
  "Suggest sharing complete field-led assignment clauses across grammar rules",
);

export const shortPrivatePrefix = rule((context) => {
  const properties = [],
    aliasTargets = new Set();
  const match = context.filename.replaceAll("\\", "/").match(/\/grammar\/statements\/([^/]+)\.js$/);
  if (!match) return {};
  const stem = match[1].replaceAll("-", "_");
  const oldName = `__${stem}_statement_prefix`,
    shorter = `__${stem}_prefix`;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) === "alias" && node.arguments.length === 2) {
        const target = memberName(node.arguments[1]);
        if (target) aliasTargets.add(target);
      }
    },
    "Program:exit"() {
      for (const property of properties) {
        if (
          ruleName(property) !== oldName ||
          callName(property.value.body) !== "seq" ||
          isRuleDisabled(context, property)
        )
          continue;
        if (aliasTargets.has(oldName) || properties.some((other) => ruleName(other) === shorter))
          continue;
        if (
          !properties.some(
            (other) => other.parent === property.parent && ruleName(other) === `${stem}_statement`,
          )
        )
          continue;
        report(
          context,
          property,
          "short-private-prefix",
          `${oldName} repeats the statement role already established by its owning file; consider ${shorter}. Check all references, metadata and name collisions before renaming, preserve exposed node names, and measure generated parser bytes. This shortens emitted symbol names without claiming a parser-count or runtime improvement.`,
        );
      }
    },
  };
}, "Suggest shorter descriptive private statement-prefix names to reduce generated C symbol text");

export const sharedDeclarationTail = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      for (let index = 0; index < node.arguments.length - 2; index++) {
        const comma = node.arguments[index];
        const value = node.arguments[index + 1];
        const terminator = node.arguments[index + 2];
        const bodyName = memberName(value),
          endName = memberName(terminator);
        if (
          (!isStaticKeywordCall(comma) && !memberName(comma)?.endsWith("_keyword")) ||
          !bodyName?.startsWith("_") ||
          bodyName.startsWith("__") ||
          !bodyName.endsWith("_body") ||
          !endName?.endsWith("_terminator")
        )
          continue;
        if (isRuleDisabled(context, terminator)) continue;
        if (isRuleDisabled(context, comma) || isRuleDisabled(context, value)) continue;
        const signature = JSON.stringify(
          [comma, value, terminator].map((part) =>
            context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
          ),
        );
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature,
        };
        const previous = sharedDeclarationTails.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous) {
          report(
            context,
            comma,
            "shared-declaration-tail",
            `This keyword, ${bodyName} and terminator clause repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact clause. Keep outer optionality and following arguments at each call site, preserve the keyword options, body fields and terminator, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedDeclarationTails.push(candidate);
      }
    },
  }),
  "Suggest sharing exact keyword-plus-body-plus-terminator fragments across grammar rules",
);

export const sharedBlockClose = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      for (let index = 0; index < node.arguments.length - 1; index++) {
        const comma = node.arguments[index];
        const value = node.arguments[index + 1];
        const bodyName = memberName(comma),
          symbol = memberName(value);
        if (
          !bodyName ||
          bodyName.startsWith("_") ||
          (bodyName !== "body" && !bodyName.endsWith("_body")) ||
          symbol !== "_end_keyword"
        )
          continue;
        if (isRuleDisabled(context, comma) || isRuleDisabled(context, value)) continue;
        const signature = JSON.stringify(
          [comma, value].map((part) =>
            context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
          ),
        );
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature,
        };
        const previous = sharedBlockCloses.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous) {
          report(
            context,
            comma,
            "shared-block-close",
            `This ${bodyName} node and END delimiter repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact pair. Keep outer optionality and following arguments at each call site, preserve the visible body node and closing delimiter, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedBlockCloses.push(candidate);
      }
    },
  }),
  "Suggest sharing exact visible-body-plus-END fragments across grammar rules",
);

export const sharedCommaContinuation = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      for (let index = 0; index < node.arguments.length - 1; index++) {
        const comma = node.arguments[index];
        const value = node.arguments[index + 1];
        if (comma.type !== "Literal" || comma.value !== ",") continue;
        const symbol = memberName(value);
        if (!symbol?.startsWith("_") || symbol.startsWith("__") || symbol.endsWith("_keyword"))
          continue;
        if (isRuleDisabled(context, comma) || isRuleDisabled(context, value)) continue;
        const signature = JSON.stringify(
          [comma, value].map((part) =>
            context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
          ),
        );
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature,
        };
        const previous = sharedCommaContinuations.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous) {
          report(
            context,
            comma,
            "shared-comma-continuation",
            `This comma and ${symbol} continuation repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact pair. Keep outer optionality and following arguments at each call site, preserve the complete continuation and its fields, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedCommaContinuations.push(candidate);
      }
    },
  }),
  "Suggest sharing exact comma-plus-continuation fragments across grammar rules",
);

export const sharedCommaField = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      for (let index = 0; index < node.arguments.length - 1; index++) {
        const comma = node.arguments[index];
        const value = node.arguments[index + 1];
        if (comma.type !== "Literal" || comma.value !== ",") continue;
        if (callName(value) !== "field" || value.arguments.length !== 2) continue;
        const label = value.arguments[0];
        const symbol = memberName(value.arguments[1]);
        if (
          label.type !== "Literal" ||
          typeof label.value !== "string" ||
          !symbol ||
          symbol.startsWith("__")
        )
          continue;
        if (isRuleDisabled(context, comma) || isRuleDisabled(context, value)) continue;
        const signature = JSON.stringify(
          [comma, value].map((part) =>
            context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
          ),
        );
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature,
        };
        const previous = sharedCommaFields.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous) {
          report(
            context,
            comma,
            "shared-comma-field",
            `This comma and ${label.value} field repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact pair. Keep outer optionality and following arguments at each call site, preserve field names and value syntax, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedCommaFields.push(candidate);
      }
    },
  }),
  "Suggest sharing exact comma-plus-field fragments across grammar rules",
);

export const sharedFieldChunk = rule((context) => {
  const candidates = [];
  const smallElement = (node) => {
    if (isSmallSequenceElement(node) || isStaticKeywordCall(node)) return true;
    if (callName(node) === "optional" && node.arguments.length === 1)
      return smallElement(node.arguments[0]);
    if (callName(node) === "field" && node.arguments.length === 2)
      return smallElement(node.arguments[1]);
    return false;
  };
  const signature = (node) =>
    context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]);
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length <= 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      for (let index = 0; index + 3 <= node.arguments.length; index++) {
        const chunk = node.arguments.slice(index, index + 3);
        const first = chunk[0];
        if (
          callName(first) !== "field" ||
          first.arguments.length !== 2 ||
          !memberName(first.arguments[1])
        )
          continue;
        if (!chunk.every(smallElement) || chunk.some((part) => isRuleDisabled(context, part)))
          continue;
        const key = JSON.stringify(chunk.map(signature));
        const previous = candidates.find(
          (candidate) =>
            candidate.key === key &&
            candidate.owner.parent === owner.parent &&
            candidate.owner !== owner,
        );
        if (previous) {
          report(
            context,
            first,
            "shared-field-chunk",
            `These three field-led elements repeat a chunk in ${ruleName(previous.owner)}; try extracting their exact sequence into a local hidden helper. Preserve fields, keyword options, order and outer optionality, check precedence relationships, then measure parser size and validate trees.`,
          );
        } else candidates.push({ key, owner });
      }
    },
  };
}, "Suggest extracting repeated three-element field-led chunks from larger local sequences");

export const optionalModifierField = rule((context) => {
  const candidates = [];
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      for (let index = 0; index + 1 < node.arguments.length; index++) {
        const modifier = node.arguments[index];
        const value = node.arguments[index + 1];
        if (callName(modifier) !== "optional" || modifier.arguments.length !== 1) continue;
        const keyword = modifier.arguments[0];
        if (!isStaticKeywordCall(keyword) && !memberName(keyword)?.endsWith("_keyword")) continue;
        if (
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          !memberName(value.arguments[1])
        )
          continue;
        if (isRuleDisabled(context, modifier) || isRuleDisabled(context, value)) continue;
        const key = JSON.stringify([signature(modifier), signature(value)]);
        const previous = candidates.find(
          (candidate) =>
            candidate.key === key &&
            candidate.owner.parent === owner.parent &&
            candidate.owner !== owner,
        );
        if (previous) {
          report(
            context,
            modifier,
            "optional-modifier-field",
            `This optional modifier and required field repeat a pair in ${ruleName(previous.owner)}; try sharing the exact pair in a hidden helper. Keep outer optionality, fields, keyword options and order unchanged, check precedence relationships, and measure one pair of call sites at a time before validating trees.`,
          );
        } else {
          candidates.push({ key, owner });
        }
      }
    },
  };
}, "Suggest sharing repeated optional-keyword and required-field pairs across local rules");

export const orderedOptionalChain = rule((context) => {
  const properties = [];
  const candidates = [];
  const references = new Map();
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const requiredElement = (node) => {
    if (memberName(node) || isStaticKeywordCall(node)) return true;
    if (node?.type === "Literal") return typeof node.value === "string" && node.value.length > 0;
    if (callName(node) === "field" && node.arguments.length === 2)
      return requiredElement(node.arguments[1]);
    if (callName(node) === "alias" && node.arguments.length === 2)
      return requiredElement(node.arguments[0]);
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
    CallExpression(node) {
      if (callName(node) === "optional" && node.arguments.length === 1) candidates.push(node);
    },
    "Program:exit"() {
      for (const node of candidates) {
        const owner = enclosingRule(node);
        if (
          !owner ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, node) ||
          !isStaticDsl(node)
        )
          continue;
        let unsafe = false;
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
            unsafe = true;
        }
        if (unsafe) continue;
        const alternatives = node.arguments[0];
        if (callName(alternatives) !== "choice" || alternatives.arguments.length !== 3) continue;
        const [first, helperUse, last] = alternatives.arguments;
        if (
          callName(first) !== "seq" ||
          first.arguments.length !== 2 ||
          !requiredElement(first.arguments[0])
        )
          continue;
        const remainder = first.arguments[1];
        if (callName(remainder) !== "optional" || remainder.arguments.length !== 1) continue;
        const suffix = remainder.arguments[0];
        if (callName(suffix) !== "choice" || suffix.arguments.length !== 2) continue;
        if (
          signature(suffix.arguments[0]) !== signature(helperUse) ||
          signature(suffix.arguments[1]) !== signature(last)
        )
          continue;
        const name = memberName(helperUse);
        if (!name?.startsWith("__") || name.endsWith("_body")) continue;
        const helper = properties.find(
          (property) => ruleName(property) === name && property.parent === owner.parent,
        );
        if (!helper || helper === owner || isRuleDisabled(context, helper)) continue;
        const body = helper.value.body;
        if (callName(body) !== "seq" || body.arguments.length !== 2 || !isStaticDsl(body)) continue;
        if (!requiredElement(body.arguments[0]) || !requiredElement(last)) continue;
        const tail = body.arguments[1];
        if (
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          signature(tail.arguments[0]) !== signature(last)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 2 || !uses.includes(helperUse) || !uses.includes(suffix.arguments[0]))
          continue;
        if (
          isRuleDisabled(context, alternatives) ||
          isRuleDisabled(context, first) ||
          isRuleDisabled(context, suffix)
        )
          continue;
        report(
          context,
          node,
          "ordered-optional-chain",
          `This nested choice enumerates three independently optional elements in order, with the last two represented by ${name}; try replacing it with three ordered optional elements and inlining that helper. Preserve fields, aliases, token identity and element order, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest simplifying nested choices that enumerate an ordered optional chain");

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

function singleUseChoiceSequenceVisitor(context, fieldChoice = false, withAlias = false) {
  const properties = [];
  const references = new Map();
  const smallElement = (node) => isSmallSequenceElement(node) || isStaticKeywordCall(node);
  const symbolAlias = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
    const source = memberName(node.arguments[0]);
    const target = memberName(node.arguments[1]);
    return (
      source !== null &&
      !source.endsWith("_keyword") &&
      target !== null &&
      !target.startsWith("_") &&
      source !== target
    );
  };
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
        if (withAlias && !body.arguments.some(symbolAlias)) continue;
        if (
          !body.arguments.every(
            (element) =>
              smallElement(element) || smallChoice(element) || (withAlias && symbolAlias(element)),
          )
        )
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
          withAlias
            ? "single-use-choice-alias-sequence"
            : fieldChoice
              ? "single-use-field-choice-sequence"
              : "single-use-choice-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence containing a ${fieldChoice ? "field-wrapped" : "direct"} choice${withAlias ? " and symbol alias" : ""}. Preserve alternative order, fields${fieldChoice || withAlias ? ", aliases" : ""} and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
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

export const singleUseChoiceAliasSequence = rule(
  (context) => singleUseChoiceSequenceVisitor(context, false, true),
  "Suggest inlining single-use private sequences combining a small choice and symbol alias",
);

export const closingDelimiterWrapper = rule((context) => {
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        const prefixName = memberName(body.arguments[0]);
        const closer = body.arguments[1];
        if (!prefixName?.startsWith("__") || closer.type !== "Literal") continue;
        const pairs = { ")": "(", "]": "[", "}": "{" };
        if (!Object.hasOwn(pairs, closer.value)) continue;
        const prefix = properties.find(
          (candidate) => ruleName(candidate) === prefixName && candidate.parent === property.parent,
        );
        if (!prefix || prefix === property || callName(prefix.value.body) !== "seq") continue;
        const opener = prefix.value.body.arguments[0];
        if (opener?.type !== "Literal" || opener.value !== pairs[closer.value]) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2 || uses.length > 4) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner === prefix ||
            owner.parent !== property.parent
          )
            return false;
          if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) return false;
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
          "closing-delimiter-wrapper",
          `${name} only appends a closing delimiter to ${prefixName} at ${uses.length} local unaliased uses; try inlining that wrapper while keeping the opening-prefix helper intact. Preserve delimiter tokens, fields and call-site precedence, check external references and metadata, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining small reused closing-delimiter wrappers while retaining their prefix helper");

export const singleUseFieldSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const smallElement = (node) =>
    isSmallSequenceElement(node) ||
    isStaticKeywordCall(node) ||
    (["token", "token.immediate"].includes(callName(node)) &&
      node.arguments.length === 1 &&
      node.arguments[0].type === "Literal" &&
      isStaticDsl(node));
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
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (
          callName(body) !== "seq" ||
          body.arguments.length < 2 ||
          body.arguments.length > 4 ||
          !body.arguments.every(smallElement) ||
          !isStaticDsl(body)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          owner = enclosingRule(use),
          field = use.parent;
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          callName(field) !== "field" ||
          field.arguments.length !== 2 ||
          field.arguments[1] !== use ||
          field.arguments[0].type !== "Literal" ||
          typeof field.arguments[0].value !== "string"
        )
          continue;
        if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) continue;
        let unsafe = false;
        for (let parent = field.parent; parent !== owner; parent = parent.parent) {
          if (
            parent.type === "CallExpression" &&
            ![
              "seq",
              "choice",
              "optional",
              "repeat",
              "repeat1",
              "prec",
              "prec.left",
              "prec.right",
            ].includes(callName(parent))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-field-sequence",
          `${name} has one local use inside the ${field.arguments[0].value} field; try inlining its complete sequence inside that same field. Preserve inner fields, lexical tokens, aliases and optionality, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining small private sequences at a single field-wrapped use");

export const singleUseFieldChoice = rule((context) => {
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
        if (!name.startsWith("_") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "choice" || body.arguments.length < 2 || body.arguments.length > 5)
          continue;
        if (
          !body.arguments.every(
            (argument) => memberName(argument) && !memberName(argument).endsWith("_keyword"),
          )
        )
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
        if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) continue;
        const field = use.parent;
        if (
          callName(field) !== "field" ||
          field.arguments.length !== 2 ||
          field.arguments[1] !== use ||
          field.arguments[0].type !== "Literal" ||
          typeof field.arguments[0].value !== "string"
        )
          continue;
        let unsafe = false;
        for (let parent = field.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-field-choice",
          `${name} has one local use inside the ${field.arguments[0].value} field; try inlining its symbol choice inside that field. Preserve alternative order, the complete field scope and call-site precedence, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use hidden symbol choices inside their existing field");

export const optionalRepetitionInline = rule((context) => {
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (
          callName(body) !== "repeat1" ||
          body.arguments.length !== 1 ||
          complexity(body) < 6 ||
          referencedSymbols(body).length === 0
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2 || uses.length > 4) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use),
            optional = use.parent;
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner.parent !== property.parent
          )
            return false;
          if (callName(optional) !== "optional" || optional.arguments.length !== 1) return false;
          if (isRuleDisabled(context, owner) || isRuleDisabled(context, optional)) return false;
          for (let parent = optional.parent; parent !== owner; parent = parent.parent) {
            if (
              ["field", "alias", "token", "token.immediate", "prec.dynamic"].includes(
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
          "optional-repetition-inline",
          `${name} is a non-empty repetition used only inside ${uses.length} local optional calls; try inlining the repetition at those calls while retaining each optional wrapper. Preserve item order, fields, aliases and precedence, check external references and metadata, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining reused private repetition wrappers whose callers are all optional");

export const singleUseDelimitedSequence = rule((context) => {
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length < 4 || body.arguments.length > 7)
          continue;
        const opener = body.arguments[0];
        const closer = body.arguments.at(-1);
        if (opener.type !== "Literal" || closer.type !== "Literal") continue;
        const pairs = { "(": ")", "[": "]", "{": "}" };
        if (!Object.hasOwn(pairs, opener.value) || pairs[opener.value] !== closer.value) continue;
        const content = body.arguments.slice(1, -1);
        if (
          !content.every(isSmallSequenceElement) ||
          content.flatMap(referencedSymbols).length === 0
        )
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
        if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) continue;
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
          "single-use-delimited-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this delimited sequence with both delimiters and its complete contents intact. Preserve fields, optionality, order and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private delimited argument sequences");

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

function singleUsePrecedenceClauseVisitor(context, valueLed = false) {
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
        if (valueLed) {
          const first = sequence.arguments[0];
          if (
            callName(first) !== "field" ||
            first.arguments.length !== 2 ||
            !memberName(first.arguments[1])
          )
            continue;
        } else if (!isKeyword(sequence.arguments[0]) || !hasField(sequence)) continue;
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
          valueLed ? "single-use-precedence-value" : "single-use-precedence-clause",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small precedence-wrapped ${valueLed ? "field-led item" : "valued clause"}. Retain associativity and fields, preserve the helper's precedence relationships, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}

export const singleUsePrecedenceClause = rule(
  (context) => singleUsePrecedenceClauseVisitor(context),
  "Suggest inlining single-use private valued clauses with static precedence wrappers",
);

export const singleUsePrecedenceValue = rule(
  (context) => singleUsePrecedenceClauseVisitor(context, true),
  "Suggest inlining single-use private field-led items with static precedence wrappers",
);

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
const sharedFieldBodies = new Map();
const sharedCommaFields = [];
const sharedCommaContinuations = [];
const sharedBlockCloses = [];
const sharedDeclarationTails = [];
const sharedAssignmentClauses = [];
const sharedDelimiterFieldPrefixes = [];
const sharedValuedFragments = [];

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
  sharedFieldBodies.clear();
  sharedCommaFields.length = 0;
  sharedCommaContinuations.length = 0;
  sharedBlockCloses.length = 0;
  sharedDeclarationTails.length = 0;
  sharedAssignmentClauses.length = 0;
  sharedDelimiterFieldPrefixes.length = 0;
  sharedValuedFragments.length = 0;
}

export const sharedFieldBody = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      const body = property.value.body;
      if (!name.startsWith("_") || !name.endsWith("_body")) continue;
      if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 5)
        continue;
      if (!isStaticDsl(body) || !body.arguments.every(isSmallSequenceElement)) continue;
      const first = body.arguments[0];
      if (callName(first) !== "field" || !memberName(first.arguments[1])) continue;
      if (referencedSymbols(body).includes(name)) continue;
      if (isRuleDisabled(context, property) || isRuleDisabled(context, body)) continue;
      const key = JSON.stringify([
        context.cwd,
        context.sourceCode.getTokens(body).map(({ type, value }) => [type, value]),
      ]);
      const candidate = {
        filename: context.filename,
        rule: name,
        start: context.sourceCode.getRange(property)[0],
        line: property.loc.start.line,
      };
      const previous = sharedFieldBodies.get(key);
      if (!previous) {
        sharedFieldBodies.set(key, candidate);
        continue;
      }
      if (previous.filename === candidate.filename && previous.start === candidate.start) continue;
      const location = `${previous.filename.split(/[\\/]/).at(-1)}:${previous.line}`;
      report(
        context,
        property,
        "shared-field-body",
        `This field-led body duplicates ${previous.rule} in ${location}; try sharing its exact sequence in one hidden helper. Retain statement-specific wrappers and precedence relationships, preserve fields, optionality and order, then measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest sharing identical small field-led hidden bodies",
);

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

function listHeadExtractionVisitor(context, mode = "embedded") {
  const precedenceHead = mode === "precedence";
  const optionalHead = mode === "optional";
  const choiceHead = mode === "choice";
  const fieldHead = mode === "field";
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
        fieldHead &&
        (callName(node.parent) !== "field" ||
          node.parent.arguments.length !== 2 ||
          node.parent.arguments[1] !== node)
      )
        return;
      if (
        precedenceHead &&
        (!["prec", "prec.left", "prec.right"].includes(callName(node.parent)) ||
          node.parent.arguments.at(-1) !== node ||
          !isStaticDsl(node.parent))
      )
        return;
      if (choiceHead && (callName(node.parent) !== "choice" || node.parent.arguments.length < 2))
        return;
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
          ].includes(callName(parent)) &&
          !(
            precedenceHead &&
            ["prec", "prec.left", "prec.right"].includes(callName(parent)) &&
            isStaticDsl(parent)
          )
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
            optionalHead || choiceHead || fieldHead || precedenceHead
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
            precedenceHead
              ? "precedence-list-head-extraction"
              : fieldHead
                ? "field-list-head-extraction"
                : choiceHead
                  ? "choice-list-head-extraction"
                  : optionalHead
                    ? "optional-list-head-extraction"
                    : "list-head-extraction",
            precedenceHead
              ? `This precedence-wrapped list repeats the item and continuation in ${tail.name}; try extracting a hidden non-empty recursive list and inlining its comma continuation when the tail has no other uses. Keep the complete precedence chain and outer fields at this call site, preserve separators, item fields and aliases, check external references and metadata, then measure parser size and validate trees.`
              : fieldHead
                ? `This field contains the item and continuation repeated by ${tail.name}; try extracting or reusing a hidden non-empty list head here and after the comma in ${tail.name}. Keep the outer field at this call site, preserve nested fields, aliases and separator optionality, check precedence relationships, then measure parser size and validate trees.`
                : choiceHead
                  ? `This choice branch repeats the item and continuation in ${tail.name}; try extracting a hidden non-empty list head and reusing it in this branch and after the comma in ${tail.name}. Preserve choice order, separator optionality, fields and aliases; check helper-specific conflicts and precedence, then measure parser size and validate trees.`
                  : optionalHead
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
  (context) => listHeadExtractionVisitor(context, "optional"),
  "Suggest extracting optional list heads duplicated in recursive comma tails",
);

export const choiceListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "choice"),
  "Suggest extracting choice-branch list heads duplicated in recursive comma tails",
);

export const precedenceListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "precedence"),
  "Suggest extracting recursive list heads while retaining call-site static precedence",
);

export const fieldListHeadExtraction = rule(
  (context) => listHeadExtractionVisitor(context, "field"),
  "Suggest extracting field-wrapped list heads duplicated in recursive comma tails",
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
    "single-use-field-sequence": singleUseFieldSequence,
    "shared-valued-fragment": sharedValuedFragment,
    "shared-delimiter-field-prefix": sharedDelimiterFieldPrefix,
    "shared-assignment-clause": sharedAssignmentClause,
    "short-private-prefix": shortPrivatePrefix,
    "shared-declaration-tail": sharedDeclarationTail,
    "shared-block-close": sharedBlockClose,
    "optional-repetition-inline": optionalRepetitionInline,
    "shared-comma-continuation": sharedCommaContinuation,
    "nullable-slot-list": nullableSlotList,
    "single-use-field-choice": singleUseFieldChoice,
    "recursive-continuation-inline": recursiveContinuationInline,
    "shared-comma-field": sharedCommaField,
    "closing-delimiter-wrapper": closingDelimiterWrapper,
    "single-use-delimited-sequence": singleUseDelimitedSequence,
    "ordered-optional-chain": orderedOptionalChain,
    "precedence-list-head-extraction": precedenceListHeadExtraction,
    "field-list-head-extraction": fieldListHeadExtraction,
    "choice-list-head-extraction": choiceListHeadExtraction,
    "shared-field-chunk": sharedFieldChunk,
    "single-use-choice-alias-sequence": singleUseChoiceAliasSequence,
    "single-use-precedence-value": singleUsePrecedenceValue,
    "optional-modifier-field": optionalModifierField,
    "shared-field-body": sharedFieldBody,
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
