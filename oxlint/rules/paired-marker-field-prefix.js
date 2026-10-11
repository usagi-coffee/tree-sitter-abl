import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const pairedMarkerFieldPrefix = rule((context) => {
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const clause = ([head, marker, value]) =>
    keyword(head) &&
    callName(marker) === "optional" &&
    marker.arguments.length === 1 &&
    keyword(marker.arguments[0]) &&
    callName(value) === "field" &&
    value.arguments.length === 2 &&
    value.arguments[0].type === "Literal" &&
    typeof value.arguments[0].value === "string" &&
    memberName(value.arguments[1]) !== null;
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length !== 6 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner)) return;
      if (referencedSymbols(node).includes(ruleName(owner))) return;
      for (let parent = node; parent !== owner; parent = parent.parent) {
        if (isRuleDisabled(context, parent)) return;
        if (
          parent.type === "CallExpression" &&
          (![
            "seq",
            "choice",
            "optional",
            "repeat",
            "repeat1",
            "prec",
            "prec.left",
            "prec.right",
          ].includes(callName(parent)) ||
            !isStaticDsl(parent))
        )
          return;
      }
      const first = node.arguments.slice(0, 3),
        second = node.arguments.slice(3);
      if (!clause(first) || !clause(second)) return;
      if (
        signature(first[0]) === signature(second[0]) ||
        signature(first[1]) !== signature(second[1]) ||
        first[2].arguments[0].value === second[2].arguments[0].value ||
        memberName(first[2].arguments[1]) !== memberName(second[2].arguments[1]) ||
        node.arguments.some((part) => isRuleDisabled(context, part)) ||
        [first[1], second[1]].some((part) => isRuleDisabled(context, part.arguments[0]))
      )
        return;
      report(
        context,
        node,
        "paired-marker-field-prefix",
        `These consecutive keyword clauses repeat an optional marker before distinct fields of the same value type; try extracting the complete ${first[2].arguments[0].value} prefix into a hidden helper. Preserve both fields, marker optionality, clause order and enclosing precedence, check competing reductions, then measure large states before actions and compare complete valid and recovery trees.`,
      );
    },
  };
}, "Suggest extracting the first clause of paired keyword, optional-marker and field sequences");
