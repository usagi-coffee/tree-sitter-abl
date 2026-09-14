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

export function resetSharingCandidates() {
  repeatedBodies.clear();
  recursiveBodies.clear();
  sharedSequences.clear();
  choiceCandidates.length = 0;
  sequenceCandidates.length = 0;
}

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
    "alternative-extraction": alternativeExtraction,
    "body-extraction": bodyExtraction,
    "broad-dispatcher": broadDispatcher,
    "chunk-extraction": chunkExtraction,
    "choice-subset": choiceSubset,
    "local-prefix-helper": localPrefixHelper,
    "non-empty-tail-extraction": nonEmptyTailExtraction,
    "optional-body-extraction": optionalBodyExtraction,
    "prefix-extraction": prefixExtraction,
    recurse: preferRecursion,
    "shared-sequence": sharedSequence,
    "shared-recursion": sharedRecursion,
    "shared-repetition": sharedRepetition,
    "single-use-sequence": singleUseSequence,
    "sequence-subset": sequenceSubset,
    "tail-extraction": tailExtraction,
    "token-packing": tokenPacking,
  },
};
