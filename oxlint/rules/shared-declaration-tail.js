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
import { sharedDeclarationTails } from "../sharing-state.js";

export const sharedDeclarationTail = rule(
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
      for (let index = 0; index < node.arguments.length - 2; index++) {
        const comma = node.arguments[index];
        const value = node.arguments[index + 1];
        const terminator = node.arguments[index + 2];
        const bodyName = memberName(value),
          endName = memberName(terminator);
        if (
          (!isStaticKeywordCall(comma) && !memberName(comma)?.endsWith("_keyword")) ||
          !bodyName?.startsWith("_") ||
          bodyName.startsWith("__") ||
          !bodyName.endsWith("_body") ||
          !endName?.endsWith("_terminator")
        )
          continue;
        if (isRuleDisabled(context, terminator)) continue;
        if (isRuleDisabled(context, comma) || isRuleDisabled(context, value)) continue;
        const signature = JSON.stringify(
          [comma, value, terminator].map((part) =>
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
        const previous = sharedDeclarationTails.find(
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
            "shared-declaration-tail",
            `This keyword, ${bodyName} and terminator clause repeat a fragment in ${previous.owner} (${previous.filename}); try extracting or reusing one hidden helper for the exact clause. Keep outer optionality and following arguments at each call site, preserve the keyword options, body fields and terminator, check visibility and precedence, then measure parser size and validate trees.`,
          );
        } else sharedDeclarationTails.push(candidate);
      }
    },
  }),
  "Suggest sharing exact keyword-plus-body-plus-terminator fragments across grammar rules",
);
