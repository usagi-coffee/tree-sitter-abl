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
import { sharedValuedFragments } from "../sharing-state.js";

export const sharedValuedFragment = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          parent.type === "CallExpression" &&
          !["seq", "choice", "optional", "repeat", "repeat1"].includes(callName(parent))
        )
          return;
      }
      for (let index = 0; index < node.arguments.length - 1; index++) {
        const [keyword, value] = node.arguments.slice(index, index + 2);
        if (!isStaticKeywordCall(keyword)) continue;
        if (
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string"
        )
          continue;
        const symbol = memberName(value.arguments[1]);
        if (
          !symbol ||
          symbol.startsWith("__") ||
          [keyword, value].some((part) => isRuleDisabled(context, part))
        )
          continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature: JSON.stringify(
            [keyword, value].map((part) =>
              context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
            ),
          ),
        };
        const previous = sharedValuedFragments.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous)
          report(
            context,
            keyword,
            "shared-valued-fragment",
            `This valued ${value.arguments[0].value} fragment repeats ${previous.owner} (${previous.filename}); try sharing this exact keyword and field in a hidden helper. Keep surrounding syntax, fields, keyword options and token identity intact, check visibility and precedence, then measure parser size and validate trees.`,
          );
        else sharedValuedFragments.push(candidate);
      }
    },
  }),
  "Suggest sharing exact keyword-and-field fragments embedded in longer sequences",
);
