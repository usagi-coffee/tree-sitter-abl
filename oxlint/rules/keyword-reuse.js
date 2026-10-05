import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticKeywordCall,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { keywordCandidates } from "../sharing-state.js";

export const keywordReuse = rule(
  (context) => ({
    CallExpression(node) {
      if (!isStaticKeywordCall(node)) return;
      const property = enclosingRule(node);
      if (!property) return;
      const wholeBody = property.value.body === node;
      if (wholeBody && !ruleName(property).startsWith("_")) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
        if (callName(parent) === "alias" && parent.arguments[0] !== node) return;
      }
      const reportNode = wholeBody ? property : node;
      if (isRuleDisabled(context, reportNode)) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        rule: ruleName(property),
        line: node.loc.start.line,
        helper: wholeBody,
        signature: JSON.stringify(
          context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
        ),
        keyword: node.arguments[0].value,
      };
      for (const previous of keywordCandidates) {
        if (previous.cwd !== candidate.cwd || previous.signature !== candidate.signature) continue;
        if (previous.helper === candidate.helper) continue;
        if (previous.filename === candidate.filename && previous.rule === candidate.rule) continue;
        const helper = previous.helper ? previous : candidate;
        const target = previous.helper ? candidate : previous;
        const sharing =
          helper.rule.startsWith("__") && helper.filename !== target.filename
            ? "promote the private keyword helper before reuse"
            : "reuse the hidden keyword helper";
        report(
          context,
          reportNode,
          "keyword-reuse",
          `${target.rule} repeats the exact ${JSON.stringify(candidate.keyword)} keyword call from ${helper.rule} (other occurrence: ${previous.filename}:${previous.line}); try to ${sharing}. Check helper-specific precedence/conflicts, then measure parser size and validate trees.`,
        );
      }
      keywordCandidates.push(candidate);
    },
  }),
  "Suggest measured reuse of existing hidden helpers for identical static keyword calls",
);
