import {
  callName,
  complexity,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
} from "../helpers.js";

export const commonSuffixHeadExtraction = rule((context) => {
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 2) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, node) || isRuleDisabled(context, owner)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      const candidate = (branch) => {
        if (callName(branch) !== "seq" || branch.arguments.length < 2 || !isStaticDsl(branch))
          return null;
        const [head, ...tail] = branch.arguments;
        const headValue = callName(head) === "field" ? head.arguments[1] : head;
        if (
          !memberName(headValue) &&
          !isStaticKeywordCall(headValue) &&
          headValue?.type !== "Literal"
        )
          return null;
        if (isNullable(head) || tail.reduce((sum, part) => sum + complexity(part), 0) < 4)
          return null;
        return { head: signature(head), tail: tail.map(signature).join("|") };
      };
      for (let index = 1; index < node.arguments.length; index += 1) {
        const left = candidate(node.arguments[index - 1]),
          right = candidate(node.arguments[index]);
        if (!left || !right || left.head === right.head || left.tail !== right.tail) continue;
        report(
          context,
          node,
          "common-suffix-head-extraction",
          "Adjacent sequence alternatives have different heads and an exact compound suffix; try placing their non-empty heads in a hidden choice helper followed by the shared suffix. Preserve alternative order, fields, aliases and precedence, then measure parser size and validate trees.",
        );
        break;
      }
    },
  };
}, "Suggest factoring shared suffixes through hidden choices of branch heads");
