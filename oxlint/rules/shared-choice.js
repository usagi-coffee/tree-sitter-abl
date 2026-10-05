import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isStaticDsl,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { sharedChoices } from "../sharing-state.js";

export const sharedChoice = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 2 || !isStaticDsl(node)) return;
      if (isNullable(node)) return;
      const property = enclosingRule(node);
      if (!property) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      let subject = node;
      while (
        ["prec", "prec.left", "prec.right", "prec.dynamic"].includes(callName(subject.parent)) &&
        subject.parent.arguments.at(-1) === subject
      )
        subject = subject.parent;
      if (!isStaticDsl(subject)) return;
      const reportNode = subject === property.value.body ? property : subject;
      if (isRuleDisabled(context, reportNode)) return;
      if (referencedSymbols(subject).includes(ruleName(property))) return;
      const signature = JSON.stringify([
        context.cwd,
        context.sourceCode.getTokens(subject).map(({ type, value }) => [type, value]),
      ]);
      const candidate = {
        filename: context.filename,
        rule: ruleName(property),
        line: subject.loc.start.line,
        helper: subject === property.value.body && ruleName(property).startsWith("_"),
      };
      const previous = sharedChoices.get(signature);
      if (!previous) {
        sharedChoices.set(signature, candidate);
        return;
      }
      if (previous.filename === candidate.filename && previous.rule === candidate.rule) return;
      const helper = previous.helper ? previous : candidate.helper ? candidate : null;
      const target = helper === candidate ? previous : candidate;
      const suggestion = !helper
        ? "extract a shared hidden choice helper"
        : helper.rule.startsWith("__") && helper.filename !== target.filename
          ? `promote private ${helper.rule} to a shared helper before reuse`
          : `reuse hidden choice ${helper.rule}`;
      report(
        context,
        reportNode,
        "shared-choice",
        `This choice repeats ${node.arguments.length} alternatives from ${previous.rule} in ${previous.filename}:${previous.line}; try to ${suggestion}. Preserve fields, aliases, order, and precedence; measure parser size and validate trees.`,
      );
      if (!previous.helper && candidate.helper) sharedChoices.set(signature, candidate);
    },
  }),
  "Suggest sharing identical non-nullable choices, including small cross-file alternative sets",
);
