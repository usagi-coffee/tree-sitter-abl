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
import { sharedDelimiterFieldPrefixes } from "../sharing-state.js";

export const sharedDelimiterFieldPrefix = rule(
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
      const pairs = { "(": ")", "[": "]", "{": "}" };
      for (let index = 0; index < node.arguments.length - 2; index++) {
        const [open, value, close] = node.arguments.slice(index, index + 3);
        if (
          open.type !== "Literal" ||
          close.type !== "Literal" ||
          !Object.hasOwn(pairs, open.value) ||
          pairs[open.value] !== close.value
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
          [open, value, close].some((part) => isRuleDisabled(context, part))
        )
          continue;
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          map: context.sourceCode.getRange(owner.parent)[0],
          signature: JSON.stringify(
            [open, value, close].map((part) =>
              context.sourceCode.getTokens(part).map(({ type, value }) => [type, value]),
            ),
          ),
        };
        const previous = sharedDelimiterFieldPrefixes.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename ||
              (other.map === candidate.map && other.owner !== candidate.owner)),
        );
        if (previous)
          report(
            context,
            open,
            "shared-delimiter-field-prefix",
            `This delimited ${value.arguments[0].value} field repeats a fragment in ${previous.owner} (${previous.filename}); try sharing only the opening delimiter and field in a hidden prefix helper, keeping the closing delimiter at each caller. Preserve optionality, fields and token identity, check visibility and precedence, then measure parser size and validate trees.`,
          );
        else sharedDelimiterFieldPrefixes.push(candidate);
      }
    },
  }),
  "Suggest sharing opening delimiters and fields while retaining closing delimiters at call sites",
);
