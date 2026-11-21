import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containsAlternatives, dslSignature, report, rule } from "../helpers.js";
import { staticSourceTokens, usedOutsideFile } from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "prompt-for-fields-body-inline";
const statement = "prompt_for_statement";
const field = "__prompt_for_field";
const record = "__prompt_for_record_body";
const fieldsBody = "__prompt_for_fields_body";
const withPhrase = "__prompt_for_with_phrase";
const fontOption = "__prompt_for_font_option";

function positionAt(keyword) {
  const signature = "seq($._kw_" + keyword + ',field("position",token({})))';
  return (node) => {
    if (dslSignature(node) !== signature) return false;
    const [, position] = node.arguments;
    const [, token] = position.arguments;
    const [number] = token.arguments;
    return number.regex?.pattern === "[0-9]+(\\.[0-9]+)?" && number.regex.flags === "";
  };
}

const measuredRules = new Map([
  [statement, "seq($.__prompt_for_prefix,$.__prompt_for_body,$._terminator)"],
  [
    "__prompt_for_prefix",
    'seq(kw("PROMPT-FOR"),optional($._stream_phrase),optional(alias(kw("UNLESS-HIDDEN"),$.unless_hidden)))',
  ],
  ["__prompt_for_body", "choice($.__prompt_for_fields_body,$.__prompt_for_record_body)"],
  [
    record,
    'seq(field("record",$.identifier),optional(seq($._kw_except,$.__prompt_for_except_fields)),optional($.in_window_phrase),optional($.frame_phrase))',
  ],
  [
    fieldsBody,
    "seq($.__prompt_for_fields,optional(alias($._go_on_phrase,$.go_on_phrase)),optional($.__prompt_for_fields_tail),optional($.editing_phrase))",
  ],
  [
    "__prompt_for_except_fields",
    "prec.right(seq(alias($._qualified_identifier,$.field),optional($.__prompt_for_except_fields)))",
  ],
  [
    "__prompt_for_fields_tail",
    "choice(seq($.in_window_phrase,optional($.__prompt_for_fields_after_window)),$.__prompt_for_fields_after_window)",
  ],
  [
    "__prompt_for_fields_after_window",
    "choice(seq($.frame_phrase,optional(alias($.__prompt_for_with_phrase,$.with_phrase))),alias($.__prompt_for_with_phrase,$.with_phrase))",
  ],
  [
    field,
    "choice(" +
      'seq(field("field",$._qualified_identifier),optional($.format_phrase),optional($._when_phrase)),' +
      'seq($._kw_text,"(",$._text_fields,")"),' +
      'seq(field("constant",$.string_literal),optional($.__prompt_for_constant_tail)),' +
      'seq($._kw_skip,optional(field("skip",$._parenthesized_value))),' +
      'seq($._kw_space,optional(field("space",$._parenthesized_value))),"^")',
  ],
  [
    "__prompt_for_fields",
    "prec.right(seq(alias($.__prompt_for_field,$.field),optional($.__prompt_for_fields)))",
  ],
  [
    "__prompt_for_constant_tail",
    "choice(seq(alias($.__prompt_for_at_phrase,$.at_phrase),optional($.__prompt_for_constant_after_position)),seq(alias($.__prompt_for_to_phrase,$.to_phrase),optional($.__prompt_for_constant_after_position)),$.__prompt_for_constant_after_position)",
  ],
  [
    "__prompt_for_constant_after_position",
    "choice(seq(alias($.__prompt_for_view_as_phrase,$.view_as_phrase),optional($.__prompt_for_constant_style_tail)),$.__prompt_for_constant_style_tail)",
  ],
  [
    "__prompt_for_constant_style_tail",
    'choice(seq($._kw_fgcolor,field("fgcolor",$._expression),optional($.__prompt_for_constant_style_after_fgcolor)),$.__prompt_for_constant_style_after_fgcolor)',
  ],
  [
    "__prompt_for_constant_style_after_fgcolor",
    'choice(seq($._kw_bgcolor,field("bgcolor",$._expression),optional($.__prompt_for_font_option)),$.__prompt_for_font_option)',
  ],
  [fontOption, 'seq($._kw_font,field("font",$._expression))'],
  ["__prompt_for_at_phrase", positionAt("at")],
  ["__prompt_for_to_phrase", positionAt("to")],
  ["__prompt_for_view_as_phrase", 'seq(kw("VIEW-AS"),field("widget",$.identifier))'],
  [withPhrase, 'seq($._kw_with,alias(kw("NO-VALIDATE"),$.no_validate))'],
]);

const expectedUses = new Map([
  [statement, 0],
  ["__prompt_for_prefix", 1],
  ["__prompt_for_body", 1],
  [record, 1],
  [fieldsBody, 1],
  ["__prompt_for_except_fields", 2],
  ["__prompt_for_fields_tail", 1],
  ["__prompt_for_fields_after_window", 2],
  [field, 1],
  ["__prompt_for_fields", 2],
  ["__prompt_for_constant_tail", 1],
  ["__prompt_for_constant_after_position", 3],
  ["__prompt_for_constant_style_tail", 2],
  ["__prompt_for_constant_style_after_fgcolor", 2],
  [fontOption, 2],
  ["__prompt_for_at_phrase", 1],
  ["__prompt_for_to_phrase", 1],
  ["__prompt_for_view_as_phrase", 1],
  [withPhrase, 2],
]);

const projectContexts = [
  [
    "grammar/core/statements.js",
    [[statement, 1]],
    ["$.subscribe_statement, $.prompt_for_statement, $.pause_statement"],
  ],
  [
    "grammar.js",
    [
      [withPhrase, 1],
      [fontOption, 1],
    ],
    [
      "[$.__prompt_for_with_phrase, $.__frame_option]",
      "$.__format_view_as_tail, $.__prompt_for_font_option, $.__put_parenthesized_count",
      '_terminator: ($) => choice($._terminator_dot, ";", $._end_of_file),',
    ],
  ],
  [
    "grammar/precedences/prompt-for.js",
    [
      [field, 1],
      [record, 2],
    ],
    [
      "export default ($) => [[$.__prompt_for_field, $.__prompt_for_record_body], [$._qualified_identifier, $.__prompt_for_record_body]]",
    ],
  ],
].map(([filename, counts, snippets]) => [filename, counts, snippets.map(staticSourceTokens)]);

function unquote(token) {
  return /^[\'"\x60]/.test(token) ? token.slice(1, -1) : token;
}

function projectUses(cwd) {
  const files = new Map();
  try {
    for (const [relative, counts, snippets] of projectContexts) {
      const filename = resolve(cwd, relative);
      const tokens = staticSourceTokens(readFileSync(filename, "utf8")).filter(
        (token, index, all) => token !== "," || ![")", "]"].includes(all[index + 1]),
      );
      if (!snippets.every((snippet) => containsAlternatives(tokens, snippet))) return null;
      for (const [name, count] of counts) {
        if (tokens.filter((token) => unquote(token) === name).length !== count) return null;
        files.set(name, [filename]);
      }
    }
  } catch {
    return null;
  }
  return files;
}

const fieldAliases = new Set(["field", "go_on_phrase"]);

function declaresFieldAlias(tokens) {
  return tokens.some(
    (token, index) =>
      fieldAliases.has(unquote(token)) &&
      (tokens[index + 1] === ":" ||
        (tokens[index - 1] === "[" && tokens[index + 1] === "]" && tokens[index + 2] === ":")),
  );
}

export const promptForFieldsBodyInline = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !==
        resolve(context.cwd, "grammar/statements/prompt-for.js")
      )
        return;

      const files = projectUses(context.cwd);
      if (!files) return;
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses, files);
      if (local?.size !== measuredRules.size || usedOutsideFile(context, declaresFieldAlias))
        return;

      report(
        context,
        local.get(fieldsBody),
        ruleId,
        "Try inlining the complete private PROMPT-FOR fields body as the first arm of the existing fields-vs-record choice. Keep the field and GO-ON aliases, option order, terminator, and the suppression on the moved sequence. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest inlining the private PROMPT-FOR fields body into its original choice",
);
