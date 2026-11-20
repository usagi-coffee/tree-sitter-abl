import { dslSignature, report, rule, ruleName } from "../helpers.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "frame-header-terminal-phrases";
const bodyName = "__frame_body";
const bodyParts = [
  'field("name",$._frame_name)',
  'choice(seq(field("record",$._qualified_identifier),$._kw_except,$._field_references),optional($.__frame_form_items))',
  "optional($.__frame_header_section)",
  "repeat($.frame_phrase)",
].join(",");
const headerItems = [
  'prec.left("frame_skip",seq($._kw_skip,optional(field("skip",seq($._parenthesized_expression_prefix,")")))))',
  "$._display_space_phrase",
  'seq(field("value",$._expression),optional($.at_phrase),optional($.__frame_display_options))',
].join(",");

function matchesFramePrefix(node) {
  if (
    dslSignature(node) !== 'seq($._define_scope_prefix,kw("FRAME",ObjectExpression),$.__frame_body)'
  )
    return false;
  const options = node.arguments[1].arguments[1].properties;
  return options.length === 1 && ruleName(options[0]) === "offset" && options[0].value.value === 4;
}

const measuredRules = new Map([
  ["frame_definition", "seq($.__frame_prefix,$._terminator)"],
  ["__frame_prefix", matchesFramePrefix],
  [bodyName, "seq(" + bodyParts + ")"],
  ["__frame_form_items", "prec.right(seq($.__frame_form_item,optional($.__frame_form_items)))"],
  [
    "__frame_header_section",
    'seq(choice(alias(kw("HEADER"),$.header),alias(kw("BACKGROUND"),$.background)),$.__frame_head_items)',
  ],
  ["__frame_head_items", "prec.right(seq($.__frame_head_item,optional($.__frame_head_items)))"],
  ["__frame_head_item", "choice(" + headerItems + ")"],
]);
const expectedUses = new Map([
  ["__frame_prefix", 1],
  [bodyName, 1],
  ["__frame_form_items", 2],
  ["__frame_header_section", 1],
  ["__frame_head_items", 2],
]);

export const frameHeaderTerminalPhrases = rule(
  (context) => ({
    "Program:exit"(program) {
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (!local || ["frame_phrase", "header", "background"].some((name) => local.has(name)))
        return;

      report(
        context,
        local.get(bodyName),
        ruleId,
        "Try making the nonempty frame phrase sequence the terminal alternative of the right-recursive FRAME header item list. Keep HEADER and BACKGROUND aliases, the required first header item, and the frame-only suffix. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest making frame phrases the terminal alternative of FRAME header items",
);
