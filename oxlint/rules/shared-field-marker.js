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
import { sharedFieldMarkers } from "../sharing-state.js";

export const sharedFieldMarker = rule(
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
      for (let index = 0; index < node.arguments.length - 2; index++) {
        const [value, keyword, following] = node.arguments.slice(index, index + 3);
        const keywordName = memberName(keyword);
        if (
          !isStaticKeywordCall(keyword) &&
          !(
            keywordName?.startsWith("_") &&
            !keywordName.startsWith("__") &&
            keywordName.endsWith("_keyword")
          )
        )
          continue;
        if (
          callName(following) !== "field" ||
          following.arguments.length !== 2 ||
          !memberName(following.arguments[1])
        )
          continue;
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
          [value, keyword].some((part) => isRuleDisabled(context, part))
        )
          continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature: JSON.stringify(
            [value, keyword].map((part) =>
              context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
            ),
          ),
        };
        const previous = sharedFieldMarkers.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous)
          report(
            context,
            value,
            "shared-field-marker",
            `This ${value.arguments[0].value}-and-marker prefix repeats ${previous.owner} (${previous.filename}); try sharing this field and following keyword marker in a hidden helper, keeping the next field at each caller. Preserve field scopes, keyword options and token identity, then measure parser size and validate trees.`,
          );
        else sharedFieldMarkers.push(candidate);
      }
    },
  }),
  "Suggest sharing field-and-marker prefixes while retaining the following field at each caller",
);
