import { callName, report, rule } from "../helpers.js";

export const preferRecursion = rule(
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
