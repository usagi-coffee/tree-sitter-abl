import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { exportTargetPresence } from "../oxlint/index.js";

const ruleId = "export-target-presence";
const statement = "seq($.__export_statement_body, $._terminator)";
const targets =
  "optional(seq(optional($.delimiter_phrase), $._expression_list, optional($.__export_tail)))";
const before = `export default ({ kw }) => ({
  export_statement: ($) => ${statement},
  __export_statement_body: ($) => seq($.__export_statement_head, ${targets}),
  __export_statement_head: ($) => seq(kw("EXPORT"), optional($._stream_phrase)),
  __export_tail: ($) =>
    choice(
      seq(seq($._kw_except, $._import_export_except_names), optional(alias(kw("NO-LOBS"), $.no_lobs))),
      alias(kw("NO-LOBS"), $.no_lobs),
    ),
});`;
const after = before
  .replace(
    statement,
    "seq(choice($.__export_statement_body, $.__export_statement_head), $._terminator)",
  )
  .replace(targets, "optional($.delimiter_phrase), $._expression_list, optional($.__export_tail)");

const root = "grammar.js";
const dispatch = "grammar/core/statements.js";
const precedence = "grammar/precedences/export.js";
const precedences = "grammar/precedences/index.js";
const common = "grammar/core/common.js";
const delimiter = "grammar/phrases/delimiter.js";
const project = {
  [root]: `import precedences from "./grammar/precedences/index.js";
export default grammar({
  conflicts: ($) => [[$.__export_statement_head]],
  precedences: ($) => precedences($),
  rules: { _terminator: ($) => choice($._terminator_dot, ";", $._end_of_file), },
});`,
  [dispatch]: `export default ($) => choice(
  $.raw_transfer_statement, $.export_statement, $.clear_statement,
);`,
  [precedence]: "export default ($) => [[$.export_statement, $._expression]];",
  [precedences]: `import grammar_export from "./export.js";
export default ($) => [...grammar_export($)];`,
  [common]: `export default ({ kw }) => ({
  _stream_phrase: ($) => seq(choice($._kw_stream, $._kw_stream_handle), field("stream", $.identifier)),
  _expression_list: ($) => prec.right(seq($._expression, optional($._expression_list))),
  _import_export_except_names: ($) => prec.right(seq($._qualified_identifier, optional($._import_export_except_names))),
});`,
  [delimiter]: `export default ({ kw }) => ({
  delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
});`,
};

const cwd = mkdtempSync(join(tmpdir(), "abl-export-target-presence-"));
const filename = join(cwd, "grammar", "statements", "export.js");
const fixture = (name, code = before) => ({ name, code, cwd, filename });
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, exportTargetPresence, { valid, invalid });

try {
  for (const [relative, source] of Object.entries(project)) {
    const file = join(cwd, relative);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, source);
  }

  test(
    ruleId,
    [
      fixture("already split before the shared terminator", after),
      { ...fixture("another module"), filename: join(cwd, "grammar", "statements", "other.js") },
      fixture(
        "required delimiter",
        before.replace("optional($.delimiter_phrase)", "$.delimiter_phrase"),
      ),
      fixture(
        "target order changed",
        before.replace(
          "optional($.delimiter_phrase), $._expression_list",
          "$._expression_list, optional($.delimiter_phrase)",
        ),
      ),
      fixture(
        "different EXCEPT names",
        before.replace("$._import_export_except_names", "$._except_field_names"),
      ),
      fixture("different NO-LOBS alias", before.replaceAll("$.no_lobs", "$.no_blobs")),
      fixture(
        "changed STREAM owner",
        before.replace("optional($._stream_phrase)", "optional($.stream_handle)"),
      ),
      fixture("changed terminator", before.replace("$._terminator", "$._no_error_terminator")),
      fixture(
        "extra body reference",
        before.replace("\n});", "\n  additional: ($) => $.__export_statement_body,\n});"),
      ),
      fixture(
        "suppressed",
        before.replace(
          "  __export_statement_body:",
          `  // oxlint-disable-next-line rule-to-test/${ruleId}\n  __export_statement_body:`,
        ),
      ),
    ],
    [
      {
        ...fixture("measured optional EXPORT target group"),
        errors: [{ message: /EXPORT targets required.*body or bare head.*shared terminator/ }],
      },
    ],
  );

  for (const [name, relative, source] of [
    ["missing conflict", root, project[root].replace("conflicts:", "inline:")],
    [
      "different conflict grouping",
      root,
      project[root].replace(
        "[$.__export_statement_head]",
        "[$.__export_statement_head, $._expression]",
      ),
    ],
    [
      "extra root reference",
      root,
      project[root] + '\nconst extra = ($) => $["__export_statement_head"];',
    ],
    ["changed terminator rule", root, project[root].replace(', ";"', "")],
    [
      "changed statement dispatch",
      dispatch,
      project[dispatch].replace("$.clear_statement", "$.other_statement"),
    ],
    [
      "reversed precedence",
      precedence,
      project[precedence].replace(
        "$.export_statement, $._expression",
        "$._expression, $.export_statement",
      ),
    ],
    [
      "extra precedence reference",
      precedence,
      project[precedence] + '\nconst extra = ($) => $["export_statement"];',
    ],
    ["inactive precedence", precedences, project[precedences].replace("...grammar_export($)", "")],
    ["changed stream field", common, project[common].replace('field("stream",', 'field("name",')],
    [
      "changed expression list",
      common,
      project[common].replace("optional($._expression_list)", "optional($._expression)"),
    ],
    [
      "changed EXCEPT recursion",
      common,
      project[common].replace(
        "optional($._import_export_except_names)",
        "$._import_export_except_names",
      ),
    ],
    [
      "changed delimiter field",
      delimiter,
      project[delimiter].replace('field("delimiter",', 'field("separator",'),
    ],
  ]) {
    const file = join(cwd, relative);
    writeFileSync(file, source);
    test(`${ruleId} ${name}`, [fixture(name)]);
    writeFileSync(file, project[relative]);
  }

  writeFileSync(
    join(cwd, "grammar", "core", "other.js"),
    'export default ($) => $["__export_tail"];',
  );
  test(`${ruleId} extra external use`, [fixture("computed private tail reference")]);
} finally {
  rmSync(cwd, { recursive: true, force: true });
}
