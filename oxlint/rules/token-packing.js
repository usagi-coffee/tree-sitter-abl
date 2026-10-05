import { callName, report, rule } from "../helpers.js";

export const tokenPacking = rule(
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
