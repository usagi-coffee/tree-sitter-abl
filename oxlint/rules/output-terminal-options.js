import { callName, report, rule } from "../helpers.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "output-terminal-options";
const bodyName = "__output_body";
const through =
  "seq($._kw_through,$._program_target,optional($.__output_program_items),optional($.__output_shared_options))";
const toOptions = [
  "$.preprocessor_name",
  "alias($._lob_dir_phrase,$.lob_dir_phrase)",
  'seq(kw("NUM-COPIES"),field("copies",$.__output_numeric_value))',
  "alias($._kw_collate,$.collate)",
  'alias(kw("LANDSCAPE"),$.landscape)',
  'alias(kw("PORTRAIT"),$.portrait)',
  'alias(kw("APPEND"),$.append)',
  'alias(kw("BINARY"),$.binary)',
  'alias(kw("KEEP-MESSAGES"),$.keep_messages)',
  "$.__output_shared_option",
].join(",");
const to = "seq($._kw_to,$.__output_to_target,repeat(choice(" + toOptions + ")))";
const programItems = [
  "$.string_literal",
  "$.number_literal",
  "$.identifier",
  "$.preprocessor_name",
  "alias($.__output_program_flag,$.program_flag)",
  "$._value_expression",
].join(",");
const sharedOptions = [
  'alias(kw("ECHO"),$.echo)',
  'alias(kw("NO-ECHO"),$.no_echo)',
  'seq($._kw_map,field("map",choice(seq($.identifier,repeat(seq("/",$.identifier))),$.string_literal)))',
  'alias(kw("NO-MAP"),$.no_map)',
  'alias(kw("PAGED"),$.paged)',
  "alias($.__output_page_size_phrase,$.page_size_phrase)",
  'alias(kw("UNBUFFERED"),$.unbuffered)',
  "alias($._convert_phrase,$.convert_phrase)",
].join(",");

function isProgramFlag(node) {
  if (callName(node) !== "token" || node.arguments.length !== 1) return false;
  const [flag] = node.arguments;
  return flag.regex?.pattern === "-[A-Za-z][A-Za-z0-9-]*" && flag.regex.flags === "";
}

const measuredRules = new Map([
  ["output_statement", "seq($.__output_prefix,$._terminator)"],
  ["__output_prefix", "seq($._kw_output,optional($._stream_phrase),$.__output_body)"],
  [bodyName, "choice(alias($._kw_close,$.close)," + to + "," + through + ")"],
  [
    "__output_program_items",
    "prec.right(seq(choice(" + programItems + "),optional($.__output_program_items)))",
  ],
  [
    "__output_shared_options",
    "prec.right(seq($.__output_shared_option,optional($.__output_shared_options)))",
  ],
  ["__output_shared_option", "choice(" + sharedOptions + ")"],
  ["__output_program_flag", isProgramFlag],
]);
const expectedUses = new Map([
  ["__output_prefix", 1],
  [bodyName, 1],
  ["__output_program_items", 2],
  ["__output_shared_options", 2],
  ["__output_shared_option", 2],
  ["__output_program_flag", 1],
  ["__output_through_tail", 0],
]);

export const outputTerminalOptions = rule(
  (context) => ({
    "Program:exit"(program) {
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (!local) return;

      report(
        context,
        local.get(bodyName).value.body.arguments[2],
        ruleId,
        "Try making the existing OUTPUT shared option list the terminal alternative of the right-recursive THROUGH program-item tail. Keep the tail optional, preserve the program target and flag alias, and leave the stream prefix, CLOSE and TO branches, and both precedence wrappers intact. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest making OUTPUT shared options the terminal alternative of the THROUGH program-item tail",
);
