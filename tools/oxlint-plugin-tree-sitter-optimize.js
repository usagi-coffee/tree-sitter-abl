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

export function resetSharingCandidates() {
  repeatedBodies.clear();
}

export const sharedRepetition = rule(
  (context) => ({
    CallExpression(node) {
      const repetition = callName(node);
      if (!["repeat", "repeat1"].includes(repetition)) return;
      if (complexity(node.arguments[0]) < 8) return;

      const property = enclosingRule(node);
      if (!property) return;

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
    "local-prefix-helper": localPrefixHelper,
    "non-empty-tail-extraction": nonEmptyTailExtraction,
    "optional-body-extraction": optionalBodyExtraction,
    "prefix-extraction": prefixExtraction,
    recurse: preferRecursion,
    "shared-repetition": sharedRepetition,
    "tail-extraction": tailExtraction,
    "token-packing": tokenPacking,
  },
};
