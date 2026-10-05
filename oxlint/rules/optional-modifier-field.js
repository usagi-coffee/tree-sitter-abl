import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const optionalModifierField = rule((context) => {
  const candidates = [];
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          [
            "alias",
            "token",
            "token.immediate",
            "prec",
            "prec.left",
            "prec.right",
            "prec.dynamic",
          ].includes(callName(parent))
        )
          return;
      }
      for (let index = 0; index + 1 < node.arguments.length; index++) {
        const modifier = node.arguments[index];
        const value = node.arguments[index + 1];
        if (callName(modifier) !== "optional" || modifier.arguments.length !== 1) continue;
        const keyword = modifier.arguments[0];
        if (!isStaticKeywordCall(keyword) && !memberName(keyword)?.endsWith("_keyword")) continue;
        if (
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          !memberName(value.arguments[1])
        )
          continue;
        if (isRuleDisabled(context, modifier) || isRuleDisabled(context, value)) continue;
        const key = JSON.stringify([signature(modifier), signature(value)]);
        const previous = candidates.find(
          (candidate) =>
            candidate.key === key &&
            candidate.owner.parent === owner.parent &&
            candidate.owner !== owner,
        );
        if (previous) {
          report(
            context,
            modifier,
            "optional-modifier-field",
            `This optional modifier and required field repeat a pair in ${ruleName(previous.owner)}; try sharing the exact pair in a hidden helper. Keep outer optionality, fields, keyword options and order unchanged, check precedence relationships, and measure one pair of call sites at a time before validating trees.`,
          );
        } else {
          candidates.push({ key, owner });
        }
      }
    },
  };
}, "Suggest sharing repeated optional-keyword and required-field pairs across local rules");
