import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { asKeywordBoundary } from "../oxlint/index.js";

const ruleId = "as-keyword-boundary";
const message =
  /retaining the shared AS reduction immediately after LIKE.*CATCH-only inline reference/;
const declaration = '_kw_as: ($) => kw("AS"),';
const keywordLike = '_kw_like: ($) => kw("LIKE"),';
const original = `export const inline = ($) => [$._kw_for, $._kw_as];
export default ({ kw }) => ({
  _kw_by: ($) => kw("BY"),
  ${declaration}
  _kw_no_undo: ($) => kw("NO-UNDO"),
  _kw_of: ($) => kw("OF"),
  ${keywordLike}
  _kw_row: ($) => kw("ROW"),
});`;
const modified = original
  .replace("$._kw_as", "$._kw_catch_as")
  .replace(`  ${declaration}\n`, "")
  .replace(keywordLike, `${keywordLike}\n  ${declaration}\n  _kw_catch_as: ($) => kw("AS"),`);
const catchSource = `export default ({ kw }) => ({
  catch_statement: ($) => seq($.__catch_prefix, $._terminator),
  __catch_prefix: ($) => seq(
    // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
    kw("CATCH"), field("name", $.identifier),
    optional(seq($._kw_as, optional($._kw_class), field("type", $._qualified_identifier))),
    $._closed_body, optional(kw("CATCH")),
  ),
});`;
const rootSource = `import coreStatements from "./grammar/core/statements.js";
import keywordRules, { COMPARISON_OPERATORS, WIDGETS, inline as inlineKeywords } from "./grammar/keywords.js";
import statements from "./grammar/statements/index.js";
export default grammar({ inline: ($) => [...inlineKeywords($), $._other],
  rules: ($) => ({ ...statements(ctx), ...keywordRules(ctx), ...coreStatements(ctx) }),
});`;
const indexSource = `import grammar_catch from "./catch.js";
export default (ctx) => ({ ...grammar_catch(ctx) });`;
const dispatchSource =
  "export default () => ({ _statement: ($) => choice($.buffer_copy_statement, $.catch_statement, $.connect_statement) });";
const directory = mkdtempSync(join(tmpdir(), "abl-as-keyword-boundary-"));
const rootFile = join(directory, "grammar.js");
const catchFile = join(directory, "grammar", "statements", "catch.js");
const indexFile = join(directory, "grammar", "statements", "index.js");
const dispatchFile = join(directory, "grammar", "core", "statements.js");
const externalFile = join(directory, "grammar", "statements", "other.js");
const precedenceFile = join(directory, "grammar", "precedences", "catch.js");
const fixture = (name, code = original, basename = "keywords.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", basename),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, asKeywordBoundary, { valid, invalid });
const insert = (line) => original.replace("\n});", `\n  ${line}\n});`);
const suppress = (line, rule = "rule-to-test/" + ruleId) =>
  original.replace(line, `// oxlint-disable-next-line ${rule}\n  ${line}`);

try {
  for (const directoryName of ["statements", "core", "precedences"])
    mkdirSync(join(directory, "grammar", directoryName), { recursive: true });
  writeFileSync(rootFile, rootSource);
  writeFileSync(catchFile, catchSource);
  writeFileSync(indexFile, indexSource);
  writeFileSync(dispatchFile, dispatchSource);

  test(
    ruleId,
    [
      fixture("measured transformation", modified),
      fixture("outside the keyword module", original, "other.js"),
      fixture("shared AS already stays out of inline", original.replace(", $._kw_as", "")),
      fixture("LIKE is also inlined", original.replace("$._kw_for,", "$._kw_like, $._kw_for,")),
      fixture("computed AS inline entry", original.replace("$._kw_as", '$["_kw_as"]')),
      fixture("duplicate AS inline entry", original.replace("$._kw_as", "$._kw_as, $._kw_as")),
      fixture("different AS token", original.replace('kw("AS")', 'kw("AS", { offset: 1 })')),
      fixture("different LIKE token", original.replace('kw("LIKE")', 'kw("LIKE", { offset: 3 })')),
      fixture("missing LIKE rule", original.replace(keywordLike, "")),
      fixture(
        "changed order",
        original
          .replace(declaration, keywordLike)
          .replace(`  ${keywordLike}\n  _kw_row`, `  ${declaration}\n  _kw_row`),
      ),
      fixture("colliding helper declaration", insert('_kw_catch_as: ($) => kw("OTHER"),')),
      fixture("colliding helper reference", insert("extra: ($) => $._kw_catch_as,")),
      fixture("extra AS grammar use", insert("extra: ($) => $._kw_as,")),
      fixture("second AS token", insert('extra: ($) => kw("as"),')),
      fixture("keyword property suppressed", suppress(declaration)),
      fixture("inline declaration suppressed", suppress("export const inline")),
    ],
    [
      { ...fixture("measured keyword order and CATCH assembly"), errors: [{ message }] },
      {
        ...fixture(
          "different suppression",
          suppress(declaration, "rule-to-test/shared-keyword-inline"),
        ),
        errors: [{ message }],
      },
    ],
  );

  for (const [name, file, source, restore] of [
    [
      "alternate CATCH type",
      catchFile,
      catchSource.replace("$._qualified_identifier", "$.identifier"),
      catchSource,
    ],
    [
      "alternate CATCH assembly",
      catchFile,
      catchSource.replace("$._terminator", "$._no_error_terminator"),
      catchSource,
    ],
    [
      "suppressed companion",
      catchFile,
      catchSource.replace(
        "optional(seq($._kw_as",
        "// oxlint-disable-next-line rule-to-test/as-keyword-boundary\n    optional(seq($._kw_as",
      ),
      catchSource,
    ],
    [
      "missing CATCH merge",
      indexFile,
      indexSource.replace("...grammar_catch(ctx)", "...other(ctx)"),
      indexSource,
    ],
    [
      "changed CATCH dispatch",
      dispatchFile,
      dispatchSource.replace("$.connect_statement", "$.other"),
      dispatchSource,
    ],
    [
      "changed inline assembly",
      rootFile,
      rootSource.replace("...inlineKeywords($)", "$._kw_as"),
      rootSource,
    ],
    [
      "extra root conflict",
      rootFile,
      rootSource.replace("rules: ($)", "conflicts: ($) => [[$._kw_as, $.other]], rules: ($)"),
      rootSource,
    ],
    ["computed root metadata", rootFile, rootSource.replace("$._other", '$["_kw_as"]'), rootSource],
    ["project precedence", precedenceFile, "export default ($) => [[$._kw_like, $.other]];"],
    [
      "external helper collision",
      externalFile,
      'export default () => ({ _kw_catch_as: ($) => kw("OTHER") });',
    ],
    [
      "external AS definition",
      externalFile,
      'export default () => ({ _kw_as : ($) => kw("OTHER") });',
    ],
    ["external LIKE token", externalFile, 'export default () => ({ other: ($) => kw("like") });'],
    ["external AS keyword", externalFile, 'export default () => ({ other: ($) => kw("as") });'],
    ["external CATCH body reference", externalFile, "export default ($) => $.__catch_prefix;"],
  ]) {
    writeFileSync(file, source);
    test(ruleId, [fixture(name)]);
    if (restore) writeFileSync(file, restore);
    else rmSync(file);
  }

  writeFileSync(
    externalFile,
    'export default () => ({ other: ($) => field("like", $._kw_like) });',
  );
  test(
    `${ruleId} shared LIKE field`,
    [],
    [{ ...fixture("existing LIKE references and field names"), errors: [{ message }] }],
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
