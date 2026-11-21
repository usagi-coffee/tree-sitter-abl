import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { sqlDeclareCursorKeywordBody } from "../oxlint/index.js";

const ruleId = "sql-declare-cursor-keyword-body";
const keyword = 'kw("DECLARE")';
const modeOptions =
  "optional(choice(alias($.__sql_read_only, $.read_only), alias($.__sql_for_update, $.for_update)))";
const before = `export default ({ kw }) => ({
  declare_cursor_statement: ($) => seq(${keyword}, $.__sql_declare_cursor_body, $._terminator),
  __sql_declare_cursor_body: ($) => seq(
    field("cursor", $.identifier), $._kw_cursor, $._kw_for,
    field("query", alias($.__sql_select_body, $.select)), ${modeOptions},
  ),
  __sql_read_only: ($) => seq($._kw_for, kw("READ"), kw("ONLY")),
  __sql_for_update: ($) => seq($._kw_for, $._kw_update, optional(seq(
    $._kw_of, field("column", $._qualified_identifier), optional($.__sql_for_update_column_tail),
  ))),
  __sql_for_update_column_tail: ($) => seq(
    ",", field("column", $._qualified_identifier), optional($.__sql_for_update_column_tail),
  ),
  select_statement: ($) => seq($.__sql_select_body, $._terminator),
  __sql_select_body: ($) => seq(kw("SELECT"), $.__sql_select_projection, $.__sql_select_from_body),
});`;
const after = before
  .replace(`${keyword}, $.__sql_declare_cursor_body`, "$.__sql_declare_cursor_body")
  .replace(
    "__sql_declare_cursor_body: ($) => seq(",
    `__sql_declare_cursor_body: ($) => seq(${keyword},`,
  );
const append = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (source, line, rule) =>
  source.replace(line, `// oxlint-disable-next-line ${rule}\n  ${line}`);
const suppression = "rule-to-test/" + ruleId;
const message = /moving the required DECLARE keyword into the existing private cursor body/;
const coreDispatch =
  "export default () => ({ _statement: ($) => choice($.other, $.declare_cursor_statement, $.open_cursor_statement, $.fetch_statement, $.close_cursor_statement, $.select_statement) });";
const commonAliases =
  'export default ({ kw }) => ({ _mode: ($) => choice($.other, alias(kw("READ-ONLY"), $.read_only)) });';

const directory = mkdtempSync(join(tmpdir(), "abl-sql-declare-cursor-"));
const root = join(directory, "grammar.js");
const dispatch = join(directory, "grammar", "core", "statements.js");
const common = join(directory, "grammar", "core", "common.js");
const keywords = join(directory, "grammar", "helpers", "keyword-data.js");
const other = join(directory, "grammar", "statements", "other.js");
const precedence = join(directory, "grammar", "precedences", "sql.js");
const fixture = (name, code = before, basename = "sql.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", basename),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, sqlDeclareCursorKeywordBody, { valid, invalid });

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "core"));
  mkdirSync(join(directory, "grammar", "precedences"));
  mkdirSync(join(directory, "grammar", "helpers"));
  writeFileSync(dispatch, coreDispatch);
  writeFileSync(common, commonAliases);
  writeFileSync(keywords, "export const keywords = `DEBUG DECLARE DEFAULT`;");
  test(
    ruleId,
    [
      fixture("measured transformation", after),
      fixture("same shape outside embedded SQL", before, "other.js"),
      fixture("optional statement keyword", before.replace(keyword, `optional(${keyword})`)),
      fixture("different DECLARE token", before.replace(keyword, 'kw("DECLARE", { offset: 4 })')),
      fixture("different cursor field", before.replace('field("cursor"', 'field("name"')),
      fixture("different query field", before.replace('field("query"', 'field("source"')),
      fixture("different query alias", before.replace("$.select)", "$.query)")),
      fixture("different cursor keyword", before.replace("$._kw_cursor", 'kw("CURSOR")')),
      fixture("different terminator", before.replace("$._terminator", "$._no_error_terminator")),
      fixture("required mode", before.replace(modeOptions, modeOptions.slice(9, -1))),
      fixture(
        "different mode order",
        before.replace(
          "alias($.__sql_read_only, $.read_only), alias($.__sql_for_update, $.for_update)",
          "alias($.__sql_for_update, $.for_update), alias($.__sql_read_only, $.read_only)",
        ),
      ),
      fixture("different update columns", before.replace('field("column"', 'field("target"')),
      fixture("different SELECT body", before.replace('"SELECT"', '"OTHER"')),
      fixture("local body reuse", append("extra: ($) => $.__sql_declare_cursor_body")),
      fixture("local cursor token collision", append('extra: ($) => kw("declare")')),
      fixture("local cursor symbol collision", append('_kw_cursor: ($) => kw("OTHER")')),
      fixture("local alias definition", append("read_only: ($) => $.other")),
      fixture("computed properties", append('["extra"]: ($) => $.other')),
      fixture("statement suppression", suppress(before, "declare_cursor_statement:", suppression)),
      fixture("body suppression", suppress(before, "__sql_declare_cursor_body:", suppression)),
      fixture(
        "keyword suppression",
        before.replace(
          `seq(${keyword},`,
          `seq(\n    // oxlint-disable-next-line ${suppression}\n    ${keyword},`,
        ),
      ),
    ],
    [
      { ...fixture("measured layout with keyword registry"), errors: [{ message }] },
      {
        ...fixture(
          "different body suppression",
          suppress(before, "__sql_declare_cursor_body:", "rule-to-test/body-extraction"),
        ),
        errors: [{ message }],
      },
    ],
  );

  const collisions = [
    ["external private body use", other, 'export default ($) => $["__sql_declare_cursor_body"];'],
    ["external cursor statement use", other, "export default ($) => $.declare_cursor_statement;"],
    ["external DECLARE token", other, 'export default ({ kw }) => kw("DECLARE");'],
    ["external lowercase DECLARE token", other, 'export default ({ kw }) => kw("declare");'],
    ["external cursor mode alias", other, "export default ($) => $.for_update;"],
    [
      "root cursor conflict",
      root,
      "export default grammar({ conflicts: ($) => [[$.declare_cursor_statement, $.other]] });",
    ],
    [
      "computed root inline metadata",
      root,
      'export default grammar({ inline: ($) => [$["declare_cursor_statement"]] });',
    ],
    [
      "cursor body precedence",
      precedence,
      "export default ($) => [[$.__sql_declare_cursor_body, $.other]];",
    ],
  ];
  for (const [name, file, source] of collisions) {
    writeFileSync(file, source);
    test(ruleId + " " + name, [fixture(name)]);
    rmSync(file);
  }

  writeFileSync(dispatch, coreDispatch.replace("$.open_cursor_statement, ", ""));
  test(ruleId + " changed cursor dispatch", [fixture("different neighboring dispatch")]);
  writeFileSync(dispatch, coreDispatch + '\nconst other = ($) => $["declare_cursor_statement"];');
  test(ruleId + " extra dispatcher reference", [fixture("extra cursor dispatch use")]);
  writeFileSync(dispatch, coreDispatch);
  writeFileSync(common, commonAliases + "\nconst other = ($) => $.read_only;");
  test(ruleId + " extra read-only reference", [fixture("extra shared mode alias")]);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
