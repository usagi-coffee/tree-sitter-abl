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

export const optionalBlockBodyExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const elements = sequenceElements(property.value.body);
      if (!elements || elements.length < 4 || isRuleDisabled(context, property)) continue;
      const body = memberName(elements.at(-1));
      if (body !== "body" && !body?.endsWith("_body")) continue;
      if (body === ruleName(property)) continue;
      if (!elements.slice(-3, -1).every((part) => callName(part) === "optional")) continue;
      report(
        context,
        property,
        "optional-block-body-extraction",
        `This sequence ends in two optional clauses and required ${body}; try extracting that non-empty suffix into a hidden helper. Preserve option order, fields, aliases and precedence, then measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest extracting optional clauses together with a required block body",
);
