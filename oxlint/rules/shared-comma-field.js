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
import { sharedCommaFields } from "../sharing-state.js";

export const sharedCommaField = rule(
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
        if (callName(value) !== "field" || value.arguments.length !== 2) continue;
        const label = value.arguments[0];
        const symbol = memberName(value.arguments[1]);
        if (
          label.type !== "Literal" ||
          typeof label.value !== "string" ||
          !symbol ||
          symbol.startsWith("__")
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
        const previous = sharedCommaFields.find(
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
            "shared-comma-field",
            `This comma and ${label.value} field repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact pair. Keep outer optionality and following arguments at each call site, preserve field names and value syntax, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedCommaFields.push(candidate);
      }
    },
  }),
  "Suggest sharing exact comma-plus-field fragments across grammar rules",
);
