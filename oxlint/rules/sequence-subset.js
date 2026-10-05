import {
  callName,
  containsAlternatives,
  enclosingRule,
  isRuleDisabled,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { sequenceCandidates } from "../sharing-state.js";

export const sequenceSubset = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length < 2) return;
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
        elements: node.arguments.map((argument) =>
          JSON.stringify(
            context.sourceCode.getTokens(argument).map(({ type, value }) => [type, value]),
          ),
        ),
        references: referencedSymbols(node),
      };
      for (const previous of sequenceCandidates) {
        if (previous.cwd !== candidate.cwd) continue;
        if (previous.filename === candidate.filename && previous.rule === candidate.rule) continue;
        let helper, target;
        if (previous.helper && containsAlternatives(candidate.elements, previous.elements)) {
          helper = previous;
          target = candidate;
        } else if (
          candidate.helper &&
          containsAlternatives(previous.elements, candidate.elements)
        ) {
          helper = candidate;
          target = previous;
        } else continue;
        if (helper.references.includes(target.rule) || target.references.includes(helper.rule))
          continue;
        const sharing =
          helper.rule.startsWith("__") && helper.filename !== target.filename
            ? "promote the private sequence to a shared helper before reuse"
            : "reuse the hidden sequence";
        report(
          context,
          reportNode,
          "sequence-subset",
          `${helper.rule} matches ${helper.elements.length} consecutive elements in ${target.rule} (other sequence: ${previous.filename}:${previous.line}); try to ${sharing}. Preserve fields, aliases, and precedence; measure parser size and validate trees.`,
        );
      }
      sequenceCandidates.push(candidate);
    },
  }),
  "Suggest reusing existing hidden sequences embedded in longer sequences",
);
