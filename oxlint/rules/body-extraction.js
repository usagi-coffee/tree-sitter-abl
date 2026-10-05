import { collectRules, complexity, report, rule, sequenceElements, unwrap } from "../helpers.js";

export const bodyExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const body = unwrap(property.value.body);
      if (complexity(body) < 28 || sequenceElements(body)?.length < 7) continue;
      report(
        context,
        property,
        "body-extraction",
        "This rule body is structurally expensive; try extracting a dedicated hidden body helper.",
      );
    }
  }),
  "Suggest extracting complex rule bodies",
);
