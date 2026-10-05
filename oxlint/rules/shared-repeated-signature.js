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
import { repeatedSignatureCandidates } from "../sharing-state.js";

export const sharedRepeatedSignature = rule(
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
      for (let i = 0; i < node.arguments.length - 1; i++) {
        const [repeat, signature] = node.arguments.slice(i, i + 2);
        if (callName(repeat) !== "repeat" || repeat.arguments.length !== 1) continue;
        const modifier = memberName(repeat.arguments[0]),
          suffix = memberName(signature);
        if (
          !modifier?.startsWith("_") ||
          modifier.startsWith("__") ||
          !suffix?.startsWith("_") ||
          suffix.startsWith("__") ||
          !suffix.endsWith("_signature")
        )
          continue;
        if (isRuleDisabled(context, repeat) || isRuleDisabled(context, signature)) continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          key: JSON.stringify(
            [repeat, signature].map((part) =>
              context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
            ),
          ),
        };
        const previous = repeatedSignatureCandidates.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.key === candidate.key &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous)
          report(
            context,
            repeat,
            "shared-repeated-signature",
            `This repeated prefix and ${suffix} signature also appear in ${previous.owner} (${previous.filename}); try sharing a header with the signature's body expanded inside it. Preserve modifier order, fields, aliases and required-field metadata, check precedence, then measure parser size and validate trees.`,
          );
        else repeatedSignatureCandidates.push(candidate);
      }
    },
  }),
  "Suggest sharing repeated modifier prefixes with expanded hidden signatures",
);
