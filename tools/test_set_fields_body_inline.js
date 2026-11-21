import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { setFieldsBodyInline } from "../oxlint/index.js";

const ruleId = "set-fields-body-inline";
const choice = "choice($._set_update_record_body, $.__set_fields_body)";
const suppression = "// oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction";
const fieldsBody = `__set_fields_body: ($) =>
    ${suppression}
    seq(
      $.__set_fields,
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($.__set_fields_tail_after_go_on),
    ),`;
const before = String.raw`export default ({ kw }) => ({
  set_statement: ($) => seq($.__set_prefix, $.__set_body, $._no_error_terminator),
  __set_prefix: ($) => seq(
    $._kw_set, optional($._stream_phrase), optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
  ),
  __set_body: ($) => ${choice},
  ${fieldsBody}
  __set_fields_tail_after_go_on: ($) => choice(
    seq($._format_validate, optional($.__set_fields_tail_after_format_validate)),
    $.__set_fields_tail_after_format_validate,
  ),
  __set_fields_tail_after_format_validate: ($) => choice(
    seq($._kw_help, field("help", $.string_literal), optional($.__set_frame_editing_tail)),
    $.__set_frame_editing_tail,
  ),
  __set_frame_editing_tail: ($) => choice(
    seq($.frame_phrase, optional($.editing_phrase)), $.editing_phrase,
  ),
  __set_field: ($) => choice(
    alias($._skip_phrase, $.skip_phrase),
    alias($._space_phrase, $.space_phrase),
    prec.right(seq(field("field", $._qualified_identifier), optional($.format_phrase), optional($._when_phrase))),
    seq(field("field", $._qualified_identifier), "=", field("value", $._expression)),
    seq(field("field", $.array_access), "=", field("value", $._expression)),
    seq($._kw_text, "(", $._text_fields, ")"),
    seq(field("constant", $.string_literal), seq($._kw_at, field("position", token(/[0-9]+(\.[0-9]+)?/)))),
    "^",
  ),
  __set_fields: ($) => prec.right(seq(alias($.__set_field, $.field), optional($.__set_fields))),
});`;
const after = before
  .replace(
    choice,
    `choice(
      $._set_update_record_body,
      ${suppression}
      seq($.__set_fields, optional(alias($._go_on_phrase, $.go_on_phrase)),
          optional($.__set_fields_tail_after_go_on)),
    )`,
  )
  .replace(`  ${fieldsBody}\n`, "");
const append = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const message = /inlining the complete private SET fields body.*second arm/;
const disable = (rule) =>
  before.replace(
    "__set_fields_body: ($)",
    `// oxlint-disable-next-line ${rule}\n  __set_fields_body: ($)`,
  );

const rootSource = `export default grammar({
  conflicts: ($) => [[$.__export_statement_head], [$.__set_prefix], [$.__underline_prefix]],
  rules: {
    _terminator: ($) => choice($._terminator_dot, ";", $._end_of_file),
    _no_error_terminator: ($) => seq(optional($.__no_error), $._terminator),
    __no_error: ($) => alias(kw("NO-ERROR"), $.no_error),
  },
});`;
const dispatch =
  "export default () => ({ _statement: ($) => choice($.repeat_statement, $.set_statement, $.enable_statement) });";
const common =
  'export default () => ({ _set_update_record_body: ($) => seq(field("record", $._qualified_identifier), optional($._except_fields), optional($.frame_phrase)), });';
const update =
  "export default () => ({ __update_prefix: ($) => seq($._kw_update, choice($._set_update_record_body, $.__update_fields_body)), });";
const setPrecedence = "export default ($) => [[$.__set_field, $._set_update_record_body]];";
const updatePrecedence =
  "export default ($) => [[$.__update_field_target, $.function_call, $._set_update_record_body]];";

const directory = mkdtempSync(join(tmpdir(), "abl-set-fields-body-"));
const root = join(directory, "grammar.js");
const statements = join(directory, "grammar", "statements");
const core = join(directory, "grammar", "core", "statements.js");
const shared = join(directory, "grammar", "core", "common.js");
const other = join(statements, "other.js");
const precedence = join(directory, "grammar", "precedences", "set.js");
const fixture = (name, code = before, file = "set.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(statements, file),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, setFieldsBodyInline, { valid, invalid });

try {
  mkdirSync(statements, { recursive: true });
  mkdirSync(join(directory, "grammar", "core"));
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(root, rootSource);
  writeFileSync(core, dispatch);
  writeFileSync(shared, common);
  writeFileSync(join(statements, "update.js"), update);
  writeFileSync(precedence, setPrecedence);
  writeFileSync(join(directory, "grammar", "precedences", "update.js"), updatePrecedence);

  test(
    ruleId,
    [
      fixture("already inlined with suppression moved", after),
      fixture("shape in another grammar module", before, "other.js"),
      fixture(
        "record arm after fields",
        before.replace(choice, "choice($.__set_fields_body, $._set_update_record_body)"),
      ),
      fixture(
        "alternative with a menu",
        before.replace(choice, "choice($.__set_fields_body, $.menu_item)"),
      ),
      fixture(
        "required GO-ON",
        before.replace(
          "optional(alias($._go_on_phrase, $.go_on_phrase))",
          "alias($._go_on_phrase, $.go_on_phrase)",
        ),
      ),
      fixture("changed GO-ON alias", before.replace("$.go_on_phrase", "$.go_on")),
      fixture(
        "changed field alias",
        before.replace("alias($.__set_field, $.field)", "alias($.__set_field, $.item)"),
      ),
      fixture(
        "changed frame arm",
        before.replace(
          "seq($.frame_phrase, optional($.editing_phrase))",
          "seq($.editing_phrase, optional($.frame_phrase))",
        ),
      ),
      fixture("changed terminator", before.replace("$._no_error_terminator", "$._terminator")),
      fixture(
        "changed right recursion",
        before.replace("prec.right(seq(alias($.__set_field", "prec.left(seq(alias($.__set_field"),
      ),
      fixture("different AT pattern", before.replace("[0-9]+(\\.[0-9]+)?", "[0-9]+")),
      fixture("suppressed fields body", disable("rule-to-test/" + ruleId)),
      fixture("additional local use", append("other: ($) => $.__set_fields_body")),
      fixture("additional alias use", append("other: ($) => alias($.__set_fields_body, $.other)")),
      fixture("local alias shadow", append("field: ($) => $.other")),
    ],
    [
      { ...fixture("measured layout with inverse suppression on sequence"), errors: [{ message }] },
      {
        ...fixture("unrelated directive", disable("rule-to-test/shared-sequence")),
        errors: [{ message }],
      },
    ],
  );

  const collisions = [
    ["external private body reference", 'export default ($) => $["__set_fields_body"];'],
    ["external private body alias", "export default ($) => alias($.other, $.__set_fields_body);"],
    ["external alias declaration", 'export default () => ({ ["go_on_phrase"]: ($) => $.other });'],
    ["external record reference", "export default ($) => $._set_update_record_body;"],
  ];
  for (const [name, source] of collisions) {
    writeFileSync(other, source);
    test(ruleId + " " + name, [fixture(name)]);
    rmSync(other);
  }

  const changes = [
    [
      root,
      rootSource,
      rootSource.replace("rules: {", 'inline: ($) => [$["__set_fields_body"]], rules: {'),
      "computed root inline metadata",
    ],
    [
      root,
      rootSource,
      rootSource.replace("[$.__set_prefix]", "[$.__set_body]"),
      "changed prefix conflict",
    ],
    [
      root,
      rootSource,
      rootSource.replace('kw("NO-ERROR")', 'kw("NO-ERROR", { offset: 4 })'),
      "changed shared NO-ERROR token",
    ],
    [core, dispatch, dispatch.replace("$.repeat_statement, ", ""), "changed statement dispatch"],
    [
      shared,
      common,
      common.replace('field("record"', 'field("target"'),
      "changed shared record field",
    ],
    [
      precedence,
      setPrecedence,
      setPrecedence.replace(
        "$.__set_field, $._set_update_record_body",
        "$._set_update_record_body, $.__set_field",
      ),
      "changed field-reference precedence",
    ],
  ];
  for (const [file, original, changed, name] of changes) {
    writeFileSync(file, changed);
    test(ruleId + " " + name, [fixture(name)]);
    writeFileSync(file, original);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
