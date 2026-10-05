import { callName, dslSignature, report, rule } from "../helpers.js";

export const alternativeExtraction = rule((context) => {
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
