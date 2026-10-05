import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const nestedFieldBodyExtraction = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length !== 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      const outer = node.parent;
      if (
        !owner ||
        callName(outer) !== "seq" ||
        outer.arguments.length !== 2 ||
        outer.arguments[1] !== node ||
        !memberName(outer.arguments[0])?.startsWith("__")
      )
        return;
      const [value, options, action] = node.arguments;
      if (
        callName(value) !== "field" ||
        value.arguments.length !== 2 ||
        value.arguments[0].type !== "Literal" ||
        typeof value.arguments[0].value !== "string" ||
        !memberName(value.arguments[1]) ||
        memberName(value.arguments[1]).startsWith("_kw_") ||
        callName(options) !== "optional" ||
        options.arguments.length !== 1 ||
        !memberName(options.arguments[0])?.startsWith("__") ||
        callName(action) !== "choice" ||
        action.arguments.length !== 2 ||
        !memberName(action.arguments[0])?.startsWith("__") ||
        memberName(action.arguments[1]) !== "_statement"
      )
        return;
      if (referencedSymbols(node).includes(ruleName(owner))) return;
      for (let parent = node; parent !== owner; parent = parent.parent) {
        if (isRuleDisabled(context, parent)) return;
        const name = callName(parent);
        if (parent.type !== "CallExpression") continue;
        if (!["seq", "choice", "prec", "prec.left", "prec.right"].includes(name)) return;
        if (!isStaticDsl(parent)) return;
      }
      if (isRuleDisabled(context, owner)) return;
      report(
        context,
        node,
        "nested-field-body-extraction",
        `This nested ${value.arguments[0].value}-led body follows a private head and combines an optional clause with a statement action choice; try extracting its exact sequence into a private non-empty body helper. Preserve field scope, option order, action alternatives and all surrounding precedence; compare action counts against state and byte costs and validate complete trees before keeping the change.`,
      );
    },
  }),
  "Suggest retaining a body boundary after private statement heads with field-led action tails",
);
