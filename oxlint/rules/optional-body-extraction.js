import { callName, memberName, report, rule } from "../helpers.js";

export const optionalBodyExtraction = rule(
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
