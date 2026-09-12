import { RuleTester } from "oxlint/plugins-dev";

import { resetSharingCandidates, sharedRepetition } from "./oxlint-plugin-tree-sitter-optimize.js";

RuleTester.describe = (_name, run) => run();
RuleTester.it = (_name, run) => run();

const repeatedTableItems = `
export default () => ({
  RULE_NAME: ($) =>
    repeat(
      choice(
        alias($._table_field, $.temp_table_field),
        alias($._table_index, $.temp_table_index),
      ),
    ),
});
`;

resetSharingCandidates();
new RuleTester().run("shared-repetition", sharedRepetition, {
  valid: [
    {
      name: "first occurrence seeds the sharing candidate",
      filename: "grammar/statements/temp-table.js",
      code: repeatedTableItems.replace("RULE_NAME", "temp_table_definition"),
    },
  ],
  invalid: [
    {
      name: "matching repetition in another file is reported",
      filename: "grammar/statements/interface.js",
      code: repeatedTableItems.replace("RULE_NAME", "interface_temp_table"),
      errors: [
        {
          message:
            "This non-trivial repetition duplicates temp_table_definition in temp-table.js; try extracting a shared hidden helper.",
        },
      ],
    },
  ],
});

console.log("✓ Optimizer lint plugin tests passed successfully");
