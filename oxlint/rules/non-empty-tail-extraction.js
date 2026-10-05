import { callName, isNullable, report, rule } from "../helpers.js";

export const nonEmptyTailExtraction = rule(
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
