import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { sharedBlockCloses } from "../sharing-state.js";

export const sharedBlockClose = rule(
  (context) => ({
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
      for (let index = 0; index < node.arguments.length - 1; index++) {
        const comma = node.arguments[index];
        const value = node.arguments[index + 1];
        const bodyName = memberName(comma),
          symbol = memberName(value);
        if (
          !bodyName ||
          bodyName.startsWith("_") ||
          (bodyName !== "body" && !bodyName.endsWith("_body")) ||
          symbol !== "_end_keyword"
        )
          continue;
        if (isRuleDisabled(context, comma) || isRuleDisabled(context, value)) continue;
        const signature = JSON.stringify(
          [comma, value].map((part) =>
            context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
          ),
        );
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature,
        };
        const previous = sharedBlockCloses.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous) {
          report(
            context,
            comma,
            "shared-block-close",
            `This ${bodyName} node and END delimiter repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact pair. Keep outer optionality and following arguments at each call site, preserve the visible body node and closing delimiter, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedBlockCloses.push(candidate);
      }
    },
  }),
  "Suggest sharing exact visible-body-plus-END fragments across grammar rules",
);
