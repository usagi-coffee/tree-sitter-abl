import {
  callName,
  complexity,
  dslSignature,
  enclosingRule,
  isRuleDisabled,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { repeatedBodies } from "../sharing-state.js";

export const sharedRepetition = rule(
  (context) => ({
    CallExpression(node) {
      const repetition = callName(node);
      if (!["repeat", "repeat1"].includes(repetition)) return;
      if (complexity(node.arguments[0]) < 8) return;

      const property = enclosingRule(node);
      if (!property) return;
      if (isRuleDisabled(context, node)) return;

      const candidate = {
        filename: context.filename,
        rule: ruleName(property),
      };
      const signature = dslSignature(node);
      const previous = repeatedBodies.get(signature);
      if (!previous) {
        repeatedBodies.set(signature, candidate);
        return;
      }

      if (previous.filename === candidate.filename && previous.rule === candidate.rule) return;
      const previousFile = previous.filename.split(/[\\/]/).at(-1);
      report(
        context,
        node,
        "shared-repetition",
        `This non-trivial repetition duplicates ${previous.rule} in ${previousFile}; try extracting a shared hidden helper.`,
      );
    },
  }),
  "Suggest sharing identical non-trivial repetitions across grammar rules",
);
