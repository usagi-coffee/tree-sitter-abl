import {
  callName,
  collectRules,
  isRuleDisabled,
  isSmallSequenceElement,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { sharedFieldBodies } from "../sharing-state.js";

export const sharedFieldBody = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      const body = property.value.body;
      if (!name.startsWith("_") || !name.endsWith("_body")) continue;
      if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 5)
        continue;
      if (!isStaticDsl(body) || !body.arguments.every(isSmallSequenceElement)) continue;
      const first = body.arguments[0];
      if (callName(first) !== "field" || !memberName(first.arguments[1])) continue;
      if (referencedSymbols(body).includes(name)) continue;
      if (isRuleDisabled(context, property) || isRuleDisabled(context, body)) continue;
      const key = JSON.stringify([
        context.cwd,
        context.sourceCode.getTokens(body).map(({ type, value }) => [type, value]),
      ]);
      const candidate = {
        filename: context.filename,
        rule: name,
        start: context.sourceCode.getRange(property)[0],
        line: property.loc.start.line,
      };
      const previous = sharedFieldBodies.get(key);
      if (!previous) {
        sharedFieldBodies.set(key, candidate);
        continue;
      }
      if (previous.filename === candidate.filename && previous.start === candidate.start) continue;
      const location = `${previous.filename.split(/[\\/]/).at(-1)}:${previous.line}`;
      report(
        context,
        property,
        "shared-field-body",
        `This field-led body duplicates ${previous.rule} in ${location}; try sharing its exact sequence in one hidden helper. Retain statement-specific wrappers and precedence relationships, preserve fields, optionality and order, then measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest sharing identical small field-led hidden bodies",
);
