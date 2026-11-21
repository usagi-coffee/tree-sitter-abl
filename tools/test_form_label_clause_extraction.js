import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { formLabelClauseExtraction } from "../oxlint/index.js";

const ruleId = "form-label-clause-extraction";
const helper = "__form_label_clause";
const directLabel = 'seq($._kw_label, optional(field("label", $.__form_label)))';
const before = `export default ({ kw }) => ({
  form_statement: ($) => seq($.__form_prefix, $._terminator),
  __form_prefix: ($) => seq(kw("FORM"), $.__form_body),
  __form_body: ($) => choice(
    prec.right(seq(alias($.__form_item, $.form_item), optional($.__form_body))),
    repeat1($.frame_phrase),
  ),
  __form_item: ($) => prec.right(choice(
    seq(alias($._kw_menu, $.identifier), optional(alias(kw("NO-LABEL"), $.no_label)),
      optional(alias(kw("NO-LABELS"), $.no_labels)), optional($._format_string)),
    seq(field("field", $._expression), optional(seq($._kw_colon, field("colon", $._expression))),
      optional(${directLabel}), optional($.__form_validate_format_view_as_tail)),
    seq($._kw_skip, optional(field("skip", $._parenthesized_value))),
    seq($._kw_space, optional(field("space", $._parenthesized_value))),
  )),
  __form_validate_format_view_as_tail: ($) => choice(
    seq(alias($.__form_validate_phrase, $.validate_phrase), optional($.__form_format_view_as_tail)),
    $.__form_format_view_as_tail,
  ),
  __form_format_view_as_tail: ($) => choice(
    seq($._format_string, optional(alias($.__form_view_as, $.view_as_phrase))),
    alias($.__form_view_as, $.view_as_phrase),
  ),
  __form_validate_phrase: ($) => seq(kw("VALIDATE"), "(", $._expression, ")"),
  __form_view_as: ($) => seq(kw("VIEW-AS"), field("widget", $.identifier)),
  __form_label: ($) => choice($.include_file_reference, $.preprocessor_name, $.string_literal, $._qualified_identifier),
});`;
const append = (source, entry) => source.replace("\n});", "\n  " + entry + ",\n});");
const after = append(
  before.replace(directLabel, "$." + helper),
  `${helper}: ($) => prec.right(${directLabel})`,
);
const measuredPrecedence = "export default ($) => [[$.__form_item, $._widgets],];";
const suppress = (rule) =>
  before.replace(
    `optional(${directLabel})`,
    `// oxlint-disable-next-line ${rule}\n      optional(${directLabel})`,
  );
const message = /extracting the optional FORM LABEL clause.*private rule carrying prec\.right/;

const directory = mkdtempSync(join(tmpdir(), "abl-form-label-clause-"));
const root = join(directory, "grammar.js");
const core = join(directory, "grammar", "core", "statements.js");
const precedence = join(directory, "grammar", "precedences", "form.js");
const other = join(directory, "grammar", "statements", "other.js");
const fixture = (name, code = before, basename = "form.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", basename),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, formLabelClauseExtraction, { valid, invalid });

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "core"));
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    core,
    "export default () => ({ _statement: ($) => choice($.form_statement, $.other) });",
  );
  writeFileSync(precedence, measuredPrecedence);
  test(
    ruleId,
    [
      fixture("measured extraction", after),
      fixture("same shape outside FORM", before, "other.js"),
      fixture(
        "left-associative FORM items",
        before.replace("prec.right(choice(", "prec.left(choice("),
      ),
      fixture("different item alias", before.replace("$.form_item)", "$.other_item)")),
      fixture(
        "different frame phrase list",
        before.replace("repeat1($.frame_phrase)", "$.frame_phrase"),
      ),
      fixture("required LABEL option", before.replace(`optional(${directLabel})`, directLabel)),
      fixture(
        "required label value",
        before.replace(
          'optional(field("label", $.__form_label))',
          'field("label", $.__form_label)',
        ),
      ),
      fixture("different label field name", before.replace('field("label"', 'field("title"')),
      fixture("different LABEL token", before.replace("$._kw_label", 'kw("LABEL")')),
      fixture("no macro label alternative", before.replace("$.preprocessor_name, ", "")),
      fixture(
        "reordered include and macro alternatives",
        before.replace(
          "$.include_file_reference, $.preprocessor_name",
          "$.preprocessor_name, $.include_file_reference",
        ),
      ),
      fixture(
        "changed trailing option order",
        before.replace(
          "seq($._format_string, optional(alias($.__form_view_as, $.view_as_phrase)))",
          "seq(alias($.__form_view_as, $.view_as_phrase), optional($._format_string))",
        ),
      ),
      fixture("suppressed LABEL option", suppress("rule-to-test/" + ruleId)),
      fixture("new helper already declared", append(before, `${helper}: ($) => $.other`)),
      fixture(
        "local label alias use",
        append(before, "other: ($) => alias($.__form_label, $.other)"),
      ),
      fixture("local keyword collision", append(before, '_kw_label: ($) => kw("OTHER")')),
      fixture("local public alias collision", append(before, "form_item: ($) => $.other")),
      fixture("computed property", append(before, '["other"]: ($) => $.other')),
    ],
    [
      { ...fixture("measured original"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress("rule-to-test/shared-sequence")),
        errors: [{ message }],
      },
    ],
  );

  const collisions = [
    ["external helper collision", other, `export default { ${helper}: ($) => $.item };`],
    ["external label use", other, 'export default { item: ($) => $["__form_label"] };'],
    [
      "additional external statement use",
      other,
      "export default { item: ($) => $.form_statement };",
    ],
    [
      "root item conflict",
      root,
      "export default grammar({ conflicts: ($) => [[$.__form_item, $.other]] });",
    ],
    [
      "computed root inline metadata",
      root,
      'export default grammar({ inline: ($) => [$["form_statement"]] });',
    ],
    [
      "extra item precedence",
      join(directory, "grammar", "precedences", "other.js"),
      "export default ($) => [[$.__form_item, $.other]];",
    ],
  ];
  for (const [name, file, source] of collisions) {
    writeFileSync(file, source);
    test(ruleId + " " + name, [fixture(name)]);
    rmSync(file);
  }

  writeFileSync(precedence, "export default ($) => [[$._widgets, $.__form_item]];");
  test(ruleId + " changed precedence", [fixture("reversed widget precedence")]);
  rmSync(precedence);
  test(ruleId + " missing precedence", [fixture("missing widget precedence")]);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
