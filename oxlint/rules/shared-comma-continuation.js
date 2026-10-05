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
import { sharedCommaContinuations } from "../sharing-state.js";

export const sharedCommaContinuation = rule(
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
        if (comma.type !== "Literal" || comma.value !== ",") continue;
        const symbol = memberName(value);
        if (!symbol?.startsWith("_") || symbol.startsWith("__") || symbol.endsWith("_keyword"))
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
        const previous = sharedCommaContinuations.find(
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
            "shared-comma-continuation",
            `This comma and ${symbol} continuation repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact pair. Keep outer optionality and following arguments at each call site, preserve the complete continuation and its fields, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedCommaContinuations.push(candidate);
      }
    },
  }),
  "Suggest sharing exact comma-plus-continuation fragments across grammar rules",
);
