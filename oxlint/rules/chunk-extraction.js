import { collectRules, complexity, report, rule, sequenceElements } from "../helpers.js";

export const chunkExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const elements = sequenceElements(property.value.body);
      if (!elements || elements.length < 12) continue;
      const complexElements = elements.filter((element) => complexity(element) >= 4);
      if (complexElements.length < 2) continue;
      report(
        context,
        property,
        "chunk-extraction",
        "This long sequence has multiple complex sections; try extracting semantic chunks.",
      );
    }
  }),
  "Suggest extracting semantic chunks from long sequences",
);
