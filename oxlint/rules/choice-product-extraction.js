import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const choiceProductExtraction = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          parent.type === "CallExpression" &&
          !["seq", "choice", "optional", "repeat", "repeat1"].includes(callName(parent))
        )
          return;
      }
      const choices = node.arguments.filter(
        (part) =>
          callName(part) === "choice" &&
          part.arguments.length >= 2 &&
          part.arguments.length <= 8 &&
          !isNullable(part),
      );
      if (choices.length < 2) return;
      const combinations = choices.reduce((total, part) => total * part.arguments.length, 1);
      if (combinations < 6) return;
      const candidate = choices.find(
        (part) =>
          !isRuleDisabled(context, part) &&
          !referencedSymbols(part).includes(ruleName(owner)) &&
          part.arguments.some((alternative) => {
            const symbol = memberName(alternative);
            return symbol && !symbol.endsWith("_keyword");
          }),
      );
      if (!candidate) return;
      report(
        context,
        candidate,
        "choice-product-extraction",
        `These ${choices.length} independent choices form ${combinations} combinations in one sequence; try extracting this valued choice into a hidden helper. Preserve alternative order, fields, aliases, tokens and call-site precedence, then measure parser bytes and counts and validate trees.`,
      );
    },
  }),
  "Suggest isolating valued choices in sequences with multiple independent alternatives",
);
