import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { promptForFieldsBodyInline } from "../oxlint/index.js";

const ruleId = "prompt-for-fields-body-inline";
const choice = "choice($.__prompt_for_fields_body, $.__prompt_for_record_body)";
const suppression = "// oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction";
const before = String.raw`export default ({ kw }) => ({
  prompt_for_statement: ($) => seq($.__prompt_for_prefix, $.__prompt_for_body, $._terminator),

  __prompt_for_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("PROMPT-FOR"),
      optional($._stream_phrase),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
    ),
  __prompt_for_body: ($) => choice($.__prompt_for_fields_body, $.__prompt_for_record_body),

  __prompt_for_record_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      field("record", $.identifier),
      optional(seq($._kw_except, $.__prompt_for_except_fields)),
      optional($.in_window_phrase),
      optional($.frame_phrase),
    ),

  __prompt_for_fields_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $.__prompt_for_fields,
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($.__prompt_for_fields_tail),
      optional($.editing_phrase),
    ),
  __prompt_for_except_fields: ($) =>
    prec.right(
      seq(alias($._qualified_identifier, $.field), optional($.__prompt_for_except_fields)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __prompt_for_fields_tail: ($) =>
    choice(
      seq($.in_window_phrase, optional($.__prompt_for_fields_after_window)),
      $.__prompt_for_fields_after_window,
    ),
  __prompt_for_fields_after_window: ($) =>
    choice(
      seq($.frame_phrase, optional(alias($.__prompt_for_with_phrase, $.with_phrase))),
      // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
      alias($.__prompt_for_with_phrase, $.with_phrase),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __prompt_for_field: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        field("field", $._qualified_identifier),
        optional($.format_phrase),
        optional($._when_phrase),
      ),
      seq($._kw_text, "(", $._text_fields, ")"),
      seq(field("constant", $.string_literal), optional($.__prompt_for_constant_tail)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_skip, optional(field("skip", $._parenthesized_value))),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_space, optional(field("space", $._parenthesized_value))),
      "^",
    ),
  __prompt_for_fields: ($) =>
    prec.right(seq(alias($.__prompt_for_field, $.field), optional($.__prompt_for_fields))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __prompt_for_constant_tail: ($) =>
    choice(
      seq(
        alias($.__prompt_for_at_phrase, $.at_phrase),
        optional($.__prompt_for_constant_after_position),
      ),
      seq(
        alias($.__prompt_for_to_phrase, $.to_phrase),
        optional($.__prompt_for_constant_after_position),
      ),
      $.__prompt_for_constant_after_position,
    ),
  __prompt_for_constant_after_position: ($) =>
    choice(
      seq(
        alias($.__prompt_for_view_as_phrase, $.view_as_phrase),
        optional($.__prompt_for_constant_style_tail),
      ),
      $.__prompt_for_constant_style_tail,
    ),
  __prompt_for_constant_style_tail: ($) =>
    choice(
      seq(
        $._kw_fgcolor,
        field("fgcolor", $._expression),
        optional($.__prompt_for_constant_style_after_fgcolor),
      ),
      $.__prompt_for_constant_style_after_fgcolor,
    ),
  __prompt_for_constant_style_after_fgcolor: ($) =>
    choice(
      seq($._kw_bgcolor, field("bgcolor", $._expression), optional($.__prompt_for_font_option)),
      $.__prompt_for_font_option,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/sequence-subset
  __prompt_for_font_option: ($) => seq($._kw_font, field("font", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __prompt_for_at_phrase: ($) => seq($._kw_at, field("position", token(/[0-9]+(\.[0-9]+)?/))),
  __prompt_for_to_phrase: ($) => seq($._kw_to, field("position", token(/[0-9]+(\.[0-9]+)?/))),
  // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
  __prompt_for_view_as_phrase: ($) => seq(kw("VIEW-AS"), field("widget", $.identifier)),
  __prompt_for_with_phrase: ($) =>
    seq(
      $._kw_with,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-VALIDATE"), $.no_validate),
    ),
});
`;
const header = "  __prompt_for_fields_body: ($) =>";
const fieldsBody = before.slice(
  before.indexOf(header),
  before.indexOf("  __prompt_for_except_fields: ($) =>"),
);
const after = before
  .replace(
    choice,
    `choice(
      ${suppression}
      seq(
        $.__prompt_for_fields,
        optional(alias($._go_on_phrase, $.go_on_phrase)),
        optional($.__prompt_for_fields_tail),
        optional($.editing_phrase),
      ),
      $.__prompt_for_record_body,
    )`,
  )
  .replace(fieldsBody, "");
const append = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const disable = (rule) =>
  before.replace(header, `  // oxlint-disable-next-line ${rule}\n${header}`);
const message = /inlining the complete private PROMPT-FOR fields body.*first arm/;

const directory = mkdtempSync(join(tmpdir(), "abl-prompt-for-fields-body-"));
const root = join(directory, "grammar.js");
const statements = join(directory, "grammar", "statements");
const core = join(directory, "grammar", "core", "statements.js");
const precedence = join(directory, "grammar", "precedences", "prompt-for.js");
const other = join(statements, "other.js");
const fixture = (name, code = before, file = "prompt-for.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(statements, file),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, promptForFieldsBodyInline, { valid, invalid });

const rootSource = `export default grammar({
  conflicts: ($) => [[$.__prompt_for_with_phrase, $.__frame_option]],
  inline: ($) => [$.__format_view_as_tail, $.__prompt_for_font_option, $.__put_parenthesized_count],
  rules: {
    _terminator: ($) => choice($._terminator_dot, ";", $._end_of_file),
  },
});`;
const dispatch =
  "export default () => ({ _statement: ($) => choice($.subscribe_statement, $.prompt_for_statement, $.pause_statement) });";
const precedences = `export default ($) => [
  [$.__prompt_for_field, $.__prompt_for_record_body],
  [$._qualified_identifier, $.__prompt_for_record_body],
];`;

try {
  mkdirSync(statements, { recursive: true });
  mkdirSync(join(directory, "grammar", "core"));
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(root, rootSource);
  writeFileSync(core, dispatch);
  writeFileSync(precedence, precedences);
  test(
    ruleId,
    [
      fixture("already inlined", after),
      fixture("other grammar module", before, "other.js"),
      fixture(
        "record arm first",
        before.replace(choice, "choice($.__prompt_for_record_body, $.__prompt_for_fields_body)"),
      ),
      fixture("changed terminator", before.replace("$._terminator)", "$._no_error_terminator)")),
      fixture(
        "changed keyword",
        before.replace('kw("PROMPT-FOR")', 'kw("PROMPT-FOR", { offset: 8 })'),
      ),
      fixture("changed GO-ON alias", before.replace("$.go_on_phrase", "$.go_on")),
      fixture(
        "changed optional order",
        before.replace(
          "optional($.__prompt_for_fields_tail),\n      optional($.editing_phrase)",
          "optional($.editing_phrase),\n      optional($.__prompt_for_fields_tail)",
        ),
      ),
      fixture("changed record field", before.replace('field("record",', 'field("target",')),
      fixture(
        "changed field item alias",
        before.replace(
          "alias($.__prompt_for_field, $.field)",
          "alias($.__prompt_for_field, $.item)",
        ),
      ),
      fixture(
        "changed list precedence",
        before.replace(
          "prec.right(seq(alias($.__prompt_for_field",
          "prec.left(seq(alias($.__prompt_for_field",
        ),
      ),
      fixture("changed position token", before.replace(String.raw`[0-9]+(\.[0-9]+)?`, "[0-9]+")),
      fixture("extra local body use", append("duplicate: ($) => $.__prompt_for_fields_body")),
      fixture(
        "aliased extra local body use",
        append("duplicate: ($) => alias($.other, $.__prompt_for_fields_body)"),
      ),
      fixture("local field alias declaration", append("field: ($) => $.other")),
      fixture("this rule suppressed", disable("rule-to-test/" + ruleId)),
    ],
    [
      {
        ...fixture("measured fields-first body with its existing suppression"),
        errors: [{ message }],
      },
    ],
  );

  for (const [name, source] of [
    ["external private reference", 'export default ($) => $["__prompt_for_fields_body"];'],
    [
      "external alias of the private body",
      "export default ($) => alias($.other, $.__prompt_for_fields_body);",
    ],
    ["external field alias declaration", 'export default { ["go_on_phrase"]: ($) => $.other };'],
  ]) {
    writeFileSync(other, source);
    test(ruleId + " " + name, [fixture(name)]);
    rmSync(other);
  }

  writeFileSync(root, rootSource.replace("_end_of_file", "_line_end"));
  test(ruleId + " changed root terminator", [fixture("different root terminator")]);
  writeFileSync(root, rootSource.replace("__put_parenthesized_count", "__other_count"));
  test(ruleId + " changed inline context", [fixture("different inline font neighborhood")]);
  writeFileSync(root, rootSource + '\nconst extra = ($) => [$["__prompt_for_fields_body"]];');
  test(ruleId + " extra root reference", [fixture("computed root reference")]);
  writeFileSync(
    root,
    rootSource.replace("[$.__prompt_for_with_phrase, $.__frame_option]", "[$.__frame_option]"),
  );
  test(ruleId + " changed frame conflict", [fixture("different frame conflict")]);
  writeFileSync(root, rootSource);

  writeFileSync(core, dispatch.replace("$.subscribe_statement, ", ""));
  test(ruleId + " changed dispatch", [fixture("different statement dispatch")]);
  writeFileSync(core, dispatch);
  writeFileSync(
    precedence,
    precedences.replace(
      "[$._qualified_identifier, $.__prompt_for_record_body]",
      "[$.__prompt_for_record_body, $._qualified_identifier]",
    ),
  );
  test(ruleId + " changed precedence", [fixture("different field-vs-record precedence")]);
  writeFileSync(precedence, precedences + '\nconst extra = ($) => $["__prompt_for_field"];');
  test(ruleId + " extra precedence reference", [fixture("extra reference in allowed file")]);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
