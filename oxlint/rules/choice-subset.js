import {
  callName,
  containsAlternatives,
  enclosingRule,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { choiceCandidates } from "../sharing-state.js";

export const choiceSubset = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 2) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = property.value.body === node ? property : node;
      if (isRuleDisabled(context, reportNode)) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        rule: ruleName(property),
        line: node.loc.start.line,
        helper: property.value.body === node && ruleName(property).startsWith("_"),
        alternatives: node.arguments.map((argument) =>
          JSON.stringify(
            context.sourceCode.getTokens(argument).map(({ type, value }) => [type, value]),
          ),
        ),
        references: node.arguments.map(memberName).filter(Boolean),
      };
      for (const previous of choiceCandidates) {
        if (previous.cwd !== candidate.cwd) continue;
        if (previous.filename === candidate.filename && previous.rule === candidate.rule) continue;
        let helper, target;
        if (
          previous.helper &&
          containsAlternatives(candidate.alternatives, previous.alternatives)
        ) {
          helper = previous;
          target = candidate;
        } else if (
          candidate.helper &&
          containsAlternatives(previous.alternatives, candidate.alternatives)
        ) {
          helper = candidate;
          target = previous;
        } else continue;
        // Avoid obvious self-recursion and already-factored dispatchers.
        if (helper.references.includes(target.rule) || target.references.includes(helper.rule))
          continue;
        const other = previous.filename.split(/[\\/]/).at(-1);
        const sharing =
          helper.rule.startsWith("__") && helper.filename !== target.filename
            ? "promote the private choice to a shared helper before reuse"
            : "reuse the hidden choice";
        report(
          context,
          reportNode,
          "choice-subset",
          `${helper.rule} matches ${helper.alternatives.length} consecutive alternatives in ${target.rule} (other choice: ${other}:${previous.line}); try to ${sharing} while preserving alternative order and precedence.`,
        );
        break;
      }
      choiceCandidates.push(candidate);
    },
  }),
  "Suggest reusing existing hidden choices inside larger choices with matching consecutive alternatives",
);
