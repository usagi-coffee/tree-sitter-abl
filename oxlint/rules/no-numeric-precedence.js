import { callName, enclosingRule, isRuleDisabled, report, rule } from "../helpers.js";

const numeric = (node) =>
  (node?.type === "Literal" && typeof node.value === "number") ||
  (node?.type === "UnaryExpression" &&
    ["+", "-"].includes(node.operator) &&
    numeric(node.argument)) ||
  (node?.type === "BinaryExpression" &&
    ["+", "-", "*", "/", "%", "**", "<<", ">>", ">>>", "|", "&", "^"].includes(node.operator) &&
    numeric(node.left) &&
    numeric(node.right));

export const noNumericPrecedence = rule(
  (context) => ({
    CallExpression(node) {
      if (
        !["prec", "prec.left", "prec.right"].includes(callName(node)) ||
        node.arguments.length !== 2 ||
        !numeric(node.arguments[0])
      )
        return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, node) || isRuleDisabled(context, owner)) return;
      let lexical = false;
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) lexical = true;
      }
      report(
        context,
        node,
        "no-numeric-precedence",
        lexical
          ? "Numeric lexical precedence is forbidden here. Named parse precedences cannot replace token priority; review the lexical design separately instead of substituting a precedence name inside token()."
          : `Replace the numeric argument to ${callName(node)} with a descriptive named precedence and declare its relative order in grammar/precedences. Preserve associativity and verify conflict resolution; do not translate numeric ranks mechanically.`,
      );
    },
  }),
  "Require named static precedence instead of numeric ranks",
);
