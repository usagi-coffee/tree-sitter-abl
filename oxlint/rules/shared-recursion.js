import {
  callName,
  collectRules,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
  sequenceElements,
} from "../helpers.js";
import { recursiveBodies } from "../sharing-state.js";

export const sharedRecursion = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      if (!name.startsWith("_")) continue;
      if (isRuleDisabled(context, property)) continue;
      const elements = sequenceElements(property.value.body);
      if (!elements || elements.length < 2) continue;
      const tail = elements.at(-1);
      if (callName(tail) !== "optional") continue;
      const content = tail.arguments[0];
      const self = callName(content) === "seq" ? content.arguments.at(-1) : content;
      if (memberName(self) !== name) continue;

      // Normalize only the recursive edge. Token signatures keep fields, aliases,
      // keyword options, regexes, and precedence intact while ignoring comments.
      const selfStart = context.sourceCode.getRange(self.property)[0];
      const signature = JSON.stringify(
        context.sourceCode
          .getTokens(property.value.body)
          .map((token) =>
            context.sourceCode.getRange(token)[0] === selfStart
              ? ["self"]
              : [token.type, token.value],
          ),
      );
      const candidate = { filename: context.filename, rule: name };
      const previous = recursiveBodies.get(signature);
      if (!previous) {
        recursiveBodies.set(signature, candidate);
        continue;
      }
      if (previous.filename === candidate.filename && previous.rule === name) continue;
      const previousFile = previous.filename.split(/[\\/]/).at(-1);
      report(
        context,
        property,
        "shared-recursion",
        `This recursive rule duplicates ${previous.rule} in ${previousFile}; try sharing one hidden helper while preserving fields, aliases, and precedence.`,
      );
    }
  }),
  "Suggest sharing identical hidden recursive lists and tails",
);
