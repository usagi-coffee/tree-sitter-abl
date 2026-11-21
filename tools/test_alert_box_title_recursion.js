import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { alertBoxTitleRecursion } from "../oxlint/index.js";

const ruleId = "alert-box-title-recursion";
const concatenation = `  _alert_box_title_concatenation: ($) =>
    prec.right("alert_title", seq($._text_operand, $._alert_box_title_concatenation_tail)),
  _alert_box_title_concatenation_tail: ($) =>
    prec.right("alert_title", seq("+", $._text_operand, optional($._alert_box_title_concatenation_tail))),`;
const recursive = `  _alert_box_title_concatenation: ($) =>
    prec.right("alert_title", seq($._text_operand, "+", choice($._alert_box_title_concatenation, $._text_operand))),`;
const before = `export default ({ kw }) => ({
  _text_operand: ($) => choice($.string_literal, $._identifier_or_access_or_call),
  _alert_box_options: ($) =>
    choice(seq(alias($._alert_type, $.alert_type), optional($._alert_box_after_type)), $._alert_box_after_type),
  _alert_box_after_type: ($) =>
    choice(seq($._alert_buttons_phrase, optional($._alert_box_title)), $._alert_box_title),
  _alert_box_title: ($) => seq($._kw_title, field("title", $._alert_box_title_value)),
  _alert_box_title_value: ($) =>
    choice($._text_operand, alias($._alert_box_title_concatenation, $.binary_expression)),
  // oxlint-disable-next-line tree-sitter-optimize/shared-precedence-sequence-inline
${concatenation}
  _unrelated: ($) => kw("UNRELATED"),
});`;

const project = {
  "grammar.js": `import precedences from "./grammar/precedences/index.js";
export default grammar({
  inline: ($) => [$._alert_box_title_value],
  precedences: ($) => precedences($),
});`,
  "grammar/precedences/index.js": `export default ($) => [
  ["alert_title", $._alert_box_title, $._alert_box_title_value, $._text_operand],
];`,
  "grammar/statements/message.js": `export default ({ kw }) => ({
  __message_body_tail: ($) => choice(
    seq(alias($.__message_view_as_phrase, $.view_as_phrase), optional($.__message_window_tail)),
    $.__message_window_tail,
  ),
  __message_view_as_phrase: ($) => seq(kw("VIEW-AS"), kw("ALERT-BOX"), optional($._alert_box_options)),
});`,
  "grammar/phrases/view-as.js": `export default ({ kw }) => ({
  __view_as_alert_box: ($) => seq(field("widget", kw("ALERT-BOX")), optional($._alert_box_options)),
});`,
  "grammar/phrases/format.js": `export default ({ kw }) => ({
  _format_view_as: ($) => seq(kw("VIEW-AS"), alias($.__view_as_alert_box, $.view_as_phrase)),
});`,
};

const cwd = mkdtempSync(join(tmpdir(), "abl-alert-box-title-"));
const fixture = (name, code = before, file = "grammar/core/common.js") => ({
  name,
  code,
  cwd,
  filename: join(cwd, file),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, alertBoxTitleRecursion, { valid, invalid });
const addLocal = (source) => before.replace("\n});", `\n  ${source},\n});`);
const suppression = `  // oxlint-disable-next-line rule-to-test/${ruleId}`;

try {
  for (const [relative, source] of Object.entries(project)) {
    const file = join(cwd, relative);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, source);
  }
  test(
    ruleId,
    [
      fixture("already recursive", before.replace(concatenation, recursive)),
      fixture("another module", before, "grammar/core/elsewhere.js"),
      fixture("different binary alias", before.replace("$.binary_expression", "$.calculation")),
      fixture("different TITLE field", before.replace('field("title",', 'field("label",')),
      fixture(
        "different operand",
        before.replace('seq("+", $._text_operand,', 'seq("+", $.identifier,'),
      ),
      fixture("different concatenation operator", before.replace('seq("+",', 'seq("-",')),
      fixture(
        "different named precedence",
        before.replace('prec.right("alert_title",', 'prec.right("other",'),
      ),
      fixture(
        "different tail associativity",
        before.replace('prec.right("alert_title", seq("+",', 'prec.left("alert_title", seq("+",'),
      ),
      fixture(
        "extra local head reference",
        addLocal("extra: ($) => $._alert_box_title_concatenation"),
      ),
      fixture(
        "extra local tail reference",
        addLocal("extra: ($) => $._alert_box_title_concatenation_tail"),
      ),
      fixture(
        "extra local named precedence",
        addLocal('extra: ($) => prec.right("alert_title", $.identifier)'),
      ),
      fixture("suppressed", before.replace(concatenation, `${suppression}\n${concatenation}`)),
    ],
    [
      {
        ...fixture("measured split TITLE concatenation"),
        errors: [{ message: /ALERT-BOX TITLE concatenation.*right recursion/ }],
      },
    ],
  );

  const precedenceFile = "grammar/precedences/index.js";
  const messageFile = "grammar/statements/message.js";
  const viewAsFile = "grammar/phrases/view-as.js";
  const formatFile = "grammar/phrases/format.js";
  for (const [name, relative, source] of [
    [
      "missing inline metadata",
      "grammar.js",
      project["grammar.js"].replace("inline:", "conflicts:"),
    ],
    [
      "changed precedence order",
      precedenceFile,
      project[precedenceFile].replace(
        "$._alert_box_title, $._alert_box_title_value",
        "$._alert_box_title_value, $._alert_box_title",
      ),
    ],
    [
      "extra reference in precedence file",
      precedenceFile,
      project[precedenceFile] + '\nconst extra = ($) => $["_alert_box_title_concatenation_tail"];',
    ],
    [
      "extra reference in root metadata",
      "grammar.js",
      project["grammar.js"].replace(
        "[$._alert_box_title_value]",
        "[$._alert_box_title_value, $._alert_box_title_concatenation]",
      ),
    ],
    [
      "changed MESSAGE alias",
      messageFile,
      project[messageFile].replace("$.view_as_phrase", "$.different_phrase"),
    ],
    [
      "changed ALERT-BOX widget",
      viewAsFile,
      project[viewAsFile].replace('field("widget",', 'field("control",'),
    ],
    [
      "changed format alias",
      formatFile,
      project[formatFile].replace("$.view_as_phrase", "$.different_phrase"),
    ],
  ]) {
    const file = join(cwd, relative);
    writeFileSync(file, source);
    test(`${ruleId} ${name}`, [fixture(name)]);
    writeFileSync(file, project[relative]);
  }

  writeFileSync(
    join(cwd, "grammar/phrases/other.js"),
    'export default ($) => $["_alert_box_title_concatenation_tail"];',
  );
  test(`${ruleId} extra external use`, [fixture("computed external tail reference")]);
} finally {
  rmSync(cwd, { recursive: true, force: true });
}
