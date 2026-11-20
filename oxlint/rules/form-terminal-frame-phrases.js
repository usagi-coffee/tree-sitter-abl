import { report, rule } from "../helpers.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "form-terminal-frame-phrases";
const bodyName = "__form_body";
const itemChoices = [
  'seq(alias($._kw_menu,$.identifier),optional(alias(kw("NO-LABEL"),$.no_label)),optional(alias(kw("NO-LABELS"),$.no_labels)),optional($._format_string))',
  'seq(field("field",$._expression),optional(seq($._kw_colon,field("colon",$._expression))),optional(seq($._kw_label,optional(field("label",$.__form_label)))),optional($.__form_validate_format_view_as_tail))',
  'seq($._kw_skip,optional(field("skip",$._parenthesized_value)))',
  'seq($._kw_space,optional(field("space",$._parenthesized_value)))',
].join(",");
const measuredRules = new Map([
  ["form_statement", "seq($.__form_prefix,$._terminator)"],
  ["__form_prefix", 'seq(kw("FORM"),$.__form_body)'],
  [bodyName, "choice(seq($.__form_items,repeat($.frame_phrase)),repeat1($.frame_phrase))"],
  ["__form_items", "prec.right(seq(alias($.__form_item,$.form_item),optional($.__form_items)))"],
  ["__form_item", "prec.right(choice(" + itemChoices + "))"],
]);
const expectedUses = new Map([
  ["__form_prefix", 1],
  [bodyName, 1],
  ["__form_items", 2],
]);

export const formTerminalFramePhrases = rule(
  (context) => ({
    "Program:exit"(program) {
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (!local || local.has("frame_phrase") || local.has("form_item")) return;

      report(
        context,
        local.get(bodyName),
        ruleId,
        "Try making the existing nonempty frame phrase sequence the terminal alternative of the right-recursive FORM body. Keep the item alias and right precedence intact, and preserve items alone, frame phrases alone, and items followed by frame phrases. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest making frame phrases the terminal alternative of the FORM body",
);
