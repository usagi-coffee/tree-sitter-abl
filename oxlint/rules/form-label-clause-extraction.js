import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { report, rule } from "../helpers.js";
import { staticSourceTokens } from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "form-label-clause-extraction";
const statementName = "form_statement";
const itemName = "__form_item";
const labelName = "__form_label";
const clauseName = "__form_label_clause";
const trailingOptionsName = "__form_validate_format_view_as_tail";
const formatViewAsName = "__form_format_view_as_tail";
const itemChoices = [
  'seq(alias($._kw_menu,$.identifier),optional(alias(kw("NO-LABEL"),$.no_label)),optional(alias(kw("NO-LABELS"),$.no_labels)),optional($._format_string))',
  'seq(field("field",$._expression),optional(seq($._kw_colon,field("colon",$._expression))),optional(seq($._kw_label,optional(field("label",$.__form_label)))),optional($.__form_validate_format_view_as_tail))',
  'seq($._kw_skip,optional(field("skip",$._parenthesized_value)))',
  'seq($._kw_space,optional(field("space",$._parenthesized_value)))',
].join(",");
const measuredRules = new Map([
  [statementName, "seq($.__form_prefix,$._terminator)"],
  ["__form_prefix", 'seq(kw("FORM"),$.__form_body)'],
  [
    "__form_body",
    "choice(prec.right(seq(alias($.__form_item,$.form_item),optional($.__form_body))),repeat1($.frame_phrase))",
  ],
  [itemName, `prec.right(choice(${itemChoices}))`],
  [
    labelName,
    "choice($.include_file_reference,$.preprocessor_name,$.string_literal,$._qualified_identifier)",
  ],
  [
    trailingOptionsName,
    "choice(seq(alias($.__form_validate_phrase,$.validate_phrase),optional($.__form_format_view_as_tail)),$.__form_format_view_as_tail)",
  ],
  [
    formatViewAsName,
    "choice(seq($._format_string,optional(alias($.__form_view_as,$.view_as_phrase))),alias($.__form_view_as,$.view_as_phrase))",
  ],
]);
const expectedUses = new Map([
  [statementName, 0],
  ["__form_prefix", 1],
  ["__form_body", 2],
  [itemName, 1],
  [labelName, 1],
  [clauseName, 0],
  [trailingOptionsName, 1],
  [formatViewAsName, 2],
]);
const sharedInputs = [
  "_terminator",
  "form_item",
  "frame_phrase",
  "_widgets",
  "_kw_menu",
  "identifier",
  "no_label",
  "no_labels",
  "_format_string",
  "_expression",
  "_kw_colon",
  "_kw_label",
  "_kw_skip",
  "_kw_space",
  "_parenthesized_value",
  "include_file_reference",
  "preprocessor_name",
  "string_literal",
  "_qualified_identifier",
  "validate_phrase",
  "view_as_phrase",
];
const measuredPrecedence = staticSourceTokens(
  "export default ($) => [[$.__form_item, $._widgets]]",
).join(" ");

function hasMeasuredPrecedence(file) {
  try {
    const tokens = staticSourceTokens(readFileSync(file, "utf8"));
    if (tokens.at(-1) === ";") tokens.pop();
    return (
      tokens.filter((token, index) => token !== "," || tokens[index + 1] !== "]").join(" ") ===
      measuredPrecedence
    );
  } catch {
    return false;
  }
}

export const formLabelClauseExtraction = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !==
        resolve(context.cwd, "grammar/statements/form.js")
      )
        return;

      const precedenceFile = resolve(context.cwd, "grammar/precedences/form.js");
      if (!hasMeasuredPrecedence(precedenceFile)) return;
      const expectedOutsideFiles = new Map([
        [statementName, [resolve(context.cwd, "grammar/core/statements.js")]],
        [itemName, [precedenceFile]],
      ]);
      const local = matchStaticRuleLayout(
        context,
        program,
        measuredRules,
        expectedUses,
        expectedOutsideFiles,
      );
      if (!local || sharedInputs.some((name) => local.has(name))) return;

      const choices = local.get(itemName).value.body.arguments[0];
      report(
        context,
        choices.arguments[1].arguments[2],
        ruleId,
        "Try extracting the optional FORM LABEL clause into a nonempty private rule carrying prec.right. Keep the optional label field and its include and macro alternatives, option order, and item alias intact. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest extracting the right-associative FORM LABEL clause",
);
