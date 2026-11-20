import { report, rule } from "../helpers.js";
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "radio-set-keyword-prefix";
const phraseName = "radio_set_phrase";
const prefixName = "__radio_set_orientation_size_prefix";
const measuredRules = new Map([
  [
    phraseName,
    'seq($._kw_radio_set,optional($.__radio_set_orientation_size_prefix),kw("RADIO-BUTTONS"),field("buttons",$._list_item_pairs),optional($.__radio_set_size_tooltip_tail))',
  ],
  [prefixName, "choice(seq($.__radio_set_orientation,optional($.size_phrase)),$.size_phrase)"],
  [
    "__radio_set_size_tooltip_tail",
    "choice(seq($.size_phrase,optional($._tooltip_phrase)),$._tooltip_phrase)",
  ],
  [
    "__radio_set_orientation",
    'choice(seq($._kw_horizontal,optional(kw("EXPAND"))),$._kw_vertical)',
  ],
]);
const expectedUses = new Map([[prefixName, 1]]);
const sharedInputs = [
  "_kw_radio_set",
  "_kw_horizontal",
  "_kw_vertical",
  "_list_item_pairs",
  "_tooltip_phrase",
  "size_phrase",
];

export const radioSetKeywordPrefix = rule(
  (context) => ({
    "Program:exit"(program) {
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (!local || sharedInputs.some((name) => local.has(name))) return;
      if (
        rootMetadataSymbols(context, [
          "conflicts",
          "externals",
          "supertypes",
          "extras",
          "word",
        ]).has(phraseName) ||
        keywordInlineSymbols(context).has(phraseName) ||
        projectPrecedenceSymbols(context).has(phraseName)
      )
        return;

      report(
        context,
        local.get(phraseName),
        ruleId,
        "Try moving the required RADIO-SET keyword into the existing orientation and size prefix. Keep the prefix options absent, orientation then optional size, or size alone. Preserve the RADIO-BUTTONS keyword, button fields, and trailing size and tooltip options. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest making the orientation and size prefix own the RADIO-SET keyword",
);
