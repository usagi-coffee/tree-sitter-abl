import { report, rule } from "../helpers.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "input-output-terminal-options";
const bodyName = "__input_output_body";
const tailName = "__input_output_through_tail";
const argumentChoice =
  "choice($.string_literal,$.number_literal,$.identifier,$.preprocessor_name,$._value_expression)";
const through =
  "seq($._kw_through,$._program_target,optional($.__input_output_arguments),optional($.__input_output_options))";
const optionChoice = [
  'alias(kw("ECHO"),$.echo)',
  'alias(kw("NO-ECHO"),$.no_echo)',
  "$._map_phrase",
  'alias(kw("UNBUFFERED"),$.unbuffered)',
  "alias($._convert_phrase,$.convert_phrase)",
].join(",");
const measuredRules = new Map([
  ["input_output_statement", "seq($.__input_output_prefix,$.__input_output_body,$._terminator)"],
  ["__input_output_prefix", "seq($._kw_input_output,optional($._stream_phrase))"],
  [bodyName, "choice(alias($._kw_close,$.close)," + through + ")"],
  [
    "__input_output_arguments",
    "prec.right(seq(" + argumentChoice + ",optional($.__input_output_arguments)))",
  ],
  [
    "__input_output_options",
    "prec.right(seq($.__input_output_option,optional($.__input_output_options)))",
  ],
  ["__input_output_option", "choice(" + optionChoice + ")"],
]);
const expectedUses = new Map([
  ["__input_output_prefix", 1],
  [bodyName, 1],
  ["__input_output_arguments", 2],
  ["__input_output_options", 2],
  ["__input_output_option", 1],
  [tailName, 0],
]);

export const inputOutputTerminalOptions = rule(
  (context) => ({
    "Program:exit"(program) {
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (!local) return;

      report(
        context,
        local.get(bodyName).value.body.arguments[1],
        ruleId,
        "Try making the existing INPUT-OUTPUT option list the terminal alternative of the right-recursive THROUGH argument tail. Keep the tail optional, preserve the CLOSE alias and program target, and retain the option aliases, order and both right-precedence wrappers. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest making INPUT-OUTPUT options the terminal alternative of the THROUGH argument tail",
);
