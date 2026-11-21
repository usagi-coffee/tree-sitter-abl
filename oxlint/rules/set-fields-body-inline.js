import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containsAlternatives, dslSignature, report, rule } from "../helpers.js";
import { staticSourceTokens, usedOutsideFile } from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "set-fields-body-inline";
const statement = "set_statement";
const prefix = "__set_prefix";
const body = "__set_body";
const fieldsBody = "__set_fields_body";
const field = "__set_field";
const record = "_set_update_record_body";

const fieldChoices = [
  "alias($._skip_phrase,$.skip_phrase)",
  "alias($._space_phrase,$.space_phrase)",
  'prec.right(seq(field("field",$._qualified_identifier),optional($.format_phrase),optional($._when_phrase)))',
  'seq(field("field",$._qualified_identifier),"=",field("value",$._expression))',
  'seq(field("field",$.array_access),"=",field("value",$._expression))',
  'seq($._kw_text,"(",$._text_fields,")")',
  'seq(field("constant",$.string_literal),seq($._kw_at,field("position",token({}))))',
  '"^"',
];
const fieldSignature = "choice(" + fieldChoices.join(",") + ")";

function matchesField(node) {
  if (dslSignature(node) !== fieldSignature) return false;
  const [, at] = node.arguments[6].arguments;
  const [, position] = at.arguments;
  const [, token] = position.arguments;
  const [number] = token.arguments;
  return number.regex?.pattern === "[0-9]+(\\.[0-9]+)?" && number.regex.flags === "";
}

const measuredRules = new Map([
  [statement, "seq($.__set_prefix,$.__set_body,$._no_error_terminator)"],
  [
    prefix,
    'seq($._kw_set,optional($._stream_phrase),optional(alias(kw("UNLESS-HIDDEN"),$.unless_hidden)))',
  ],
  [body, "choice($._set_update_record_body,$.__set_fields_body)"],
  [
    fieldsBody,
    "seq($.__set_fields,optional(alias($._go_on_phrase,$.go_on_phrase)),optional($.__set_fields_tail_after_go_on))",
  ],
  [
    "__set_fields_tail_after_go_on",
    "choice(seq($._format_validate,optional($.__set_fields_tail_after_format_validate)),$.__set_fields_tail_after_format_validate)",
  ],
  [
    "__set_fields_tail_after_format_validate",
    'choice(seq($._kw_help,field("help",$.string_literal),optional($.__set_frame_editing_tail)),$.__set_frame_editing_tail)',
  ],
  [
    "__set_frame_editing_tail",
    "choice(seq($.frame_phrase,optional($.editing_phrase)),$.editing_phrase)",
  ],
  [field, matchesField],
  ["__set_fields", "prec.right(seq(alias($.__set_field,$.field),optional($.__set_fields)))"],
]);

const expectedUses = new Map([
  [statement, 0],
  [prefix, 1],
  [body, 1],
  [fieldsBody, 1],
  [record, 1],
  ["__set_fields", 2],
  ["__set_fields_tail_after_go_on", 1],
  ["__set_fields_tail_after_format_validate", 2],
  ["__set_frame_editing_tail", 2],
  [field, 1],
]);

const contexts = [
  [
    "grammar/core/statements.js",
    [statement],
    ["$.repeat_statement, $.set_statement, $.enable_statement"],
  ],
  [
    "grammar.js",
    [prefix],
    [
      "[$.__export_statement_head], [$.__set_prefix], [$.__underline_prefix]",
      '_terminator: ($) => choice($._terminator_dot, ";", $._end_of_file), _no_error_terminator: ($) => seq(optional($.__no_error), $._terminator), __no_error: ($) => alias(kw("NO-ERROR"), $.no_error),',
    ],
  ],
  [
    "grammar/core/common.js",
    [record],
    [
      '_set_update_record_body: ($) => seq(field("record", $._qualified_identifier), optional($._except_fields), optional($.frame_phrase)),',
    ],
  ],
  [
    "grammar/precedences/set.js",
    [field, record],
    ["export default ($) => [[$.__set_field, $._set_update_record_body]]"],
  ],
  [
    "grammar/statements/update.js",
    [record],
    [
      "__update_prefix: ($) => seq($._kw_update, choice($._set_update_record_body, $.__update_fields_body))",
    ],
  ],
  [
    "grammar/precedences/update.js",
    [record],
    ["[$.__update_field_target, $.function_call, $._set_update_record_body]"],
  ],
].map(([filename, names, snippets]) => [filename, names, snippets.map(staticSourceTokens)]);

const aliases = new Set(["field", "go_on_phrase", "skip_phrase", "space_phrase", "unless_hidden"]);

function unquote(token) {
  return /^[\'"\x60]/.test(token) ? token.slice(1, -1) : token;
}

function expectedProjectUses(cwd) {
  const files = new Map();
  try {
    for (const [relative, names, snippets] of contexts) {
      const filename = resolve(cwd, relative);
      const tokens = staticSourceTokens(readFileSync(filename, "utf8")).filter(
        (token, index, all) => token !== "," || ![")", "]"].includes(all[index + 1]),
      );
      if (!snippets.every((snippet) => containsAlternatives(tokens, snippet))) return null;
      for (const name of names) {
        if (tokens.filter((token) => unquote(token) === name).length !== 1) return null;
        files.set(name, [...(files.get(name) ?? []), filename]);
      }
    }
  } catch {
    return null;
  }
  return files;
}

function declaresSetAlias(tokens) {
  return tokens.some(
    (token, index) =>
      aliases.has(unquote(token)) &&
      (tokens[index + 1] === ":" ||
        (tokens[index - 1] === "[" && tokens[index + 1] === "]" && tokens[index + 2] === ":")),
  );
}

export const setFieldsBodyInline = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !== resolve(context.cwd, "grammar/statements/set.js")
      )
        return;
      const files = expectedProjectUses(context.cwd);
      if (!files) return;
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses, files);
      if (local?.size !== measuredRules.size || usedOutsideFile(context, declaresSetAlias)) return;

      report(
        context,
        local.get(fieldsBody),
        ruleId,
        "Try inlining the complete private SET fields body as the second arm of the existing record-vs-fields choice. Keep the field and GO-ON aliases, option order, NO-ERROR terminator, and any suppression attached to the moved sequence. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest inlining the private SET fields body into its original choice",
);
