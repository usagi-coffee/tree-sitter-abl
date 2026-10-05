import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isSmallSequenceElement,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const sharedFieldChunk = rule((context) => {
  const candidates = [];
  const smallElement = (node) => {
    if (isSmallSequenceElement(node) || isStaticKeywordCall(node)) return true;
    if (callName(node) === "optional" && node.arguments.length === 1)
      return smallElement(node.arguments[0]);
    if (callName(node) === "field" && node.arguments.length === 2)
      return smallElement(node.arguments[1]);
    return false;
  };
  const signature = (node) =>
    context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]);
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length <= 3 || !isStaticDsl(node)) return;
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
      for (let index = 0; index + 3 <= node.arguments.length; index++) {
        const chunk = node.arguments.slice(index, index + 3);
        const first = chunk[0];
        if (
          callName(first) !== "field" ||
          first.arguments.length !== 2 ||
          !memberName(first.arguments[1])
        )
          continue;
        if (!chunk.every(smallElement) || chunk.some((part) => isRuleDisabled(context, part)))
          continue;
        const key = JSON.stringify(chunk.map(signature));
        const previous = candidates.find(
          (candidate) =>
            candidate.key === key &&
            candidate.owner.parent === owner.parent &&
            candidate.owner !== owner,
        );
        if (previous) {
          report(
            context,
            first,
            "shared-field-chunk",
            `These three field-led elements repeat a chunk in ${ruleName(previous.owner)}; try extracting their exact sequence into a local hidden helper. Preserve fields, keyword options, order and outer optionality, check precedence relationships, then measure parser size and validate trees.`,
          );
        } else candidates.push({ key, owner });
      }
    },
  };
}, "Suggest extracting repeated three-element field-led chunks from larger local sequences");
