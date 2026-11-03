import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { optionalFlagPairExtraction } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-optional-flag-pair-"));
const fixture = readFileSync(new URL("./fixtures/browse-lock-wait.js", import.meta.url), "utf8");
const family = 'alias(choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")), $.lock)';
const single = 'alias(kw("NO-WAIT"), $.no_wait)';
const first = `optional(${family})`;
const second = `optional(${single})`;
const testCase = (name, code = fixture) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /adjacent optional flags.*keyword family.*separate flag.*only the ordered pair.*optional non-empty helper.*trailing flag alone.*preceding field and following keyword at the caller.*recovery.*aliases, token identities and order.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;
const wrapBody = (wrapper, prefix = "") =>
  fixture.replace("seq(", `${wrapper}(${prefix}seq(`).replace("\n    ),", "\n    )),");
const metadataCase = (metadata) =>
  fixture
    .replace(
      "export default ({ kw }) => ({",
      `export default grammar({ ${metadata}: ($) => [$.__browse_body], rules: {`,
    )
    .replace("\n});", "\n} });");

try {
  new RuleTester().run("optional-flag-pair-extraction", optionalFlagPairExtraction, {
    valid: [
      testCase(
        "measured optional helper",
        fixture.replace(`${first},\n      ${second}`, "optional($.__browse_lock_wait)"),
      ),
      ...[
        family,
        'optional(kw("SHARE-LOCK"))',
        'optional(alias(kw("SHARE-LOCK"), $.lock))',
        'optional(alias(choice(kw("SHARE-LOCK")), $.lock))',
        'optional(alias(choice(kw("SHARE-LOCK"), $.identifier), $.lock))',
        'optional(alias(choice(kw("SHARE-LOCK"), kw("SHARE-LOCK")), $.lock))',
        'optional(alias(choice(kw("SHARE-LOCK"), kw("NO-WAIT")), $.lock))',
        'optional(alias(choice(kw("SHARE-LOCK"), kw("NO-LOCK")), $.__lock))',
        'optional(alias(choice(kw("SHARE-LOCK"), kw(mode)), $.lock))',
        'optional(alias(choice(kw("SHARE-LOCK", settings), kw("NO-LOCK")), $.lock))',
      ].map((replacement) =>
        testCase(`unsupported family: ${replacement}`, fixture.replace(first, replacement)),
      ),
      ...[
        single,
        'optional(kw("NO-WAIT"))',
        'optional(alias(choice(kw("NO-WAIT"), kw("WAIT")), $.no_wait))',
        'optional(alias(kw("NO-WAIT"), $.lock))',
        'optional(alias(kw("NO-WAIT"), $.__no_wait))',
        "optional(alias(token(/NO-WAIT/i), $.no_wait))",
        'optional(alias(kw("NO-WAIT", { offset: minimum }), $.no_wait))',
        'repeat(alias(kw("NO-WAIT"), $.no_wait))',
      ].map((replacement) =>
        testCase(`unsupported second flag: ${replacement}`, fixture.replace(second, replacement)),
      ),
      testCase(
        "reversed flags",
        fixture.replace(first, "FIRST_FLAG").replace(second, first).replace("FIRST_FLAG", second),
      ),
      testCase("nonadjacent flags", fixture.replace(second, `$.separator, ${second}`)),
      testCase("optional marker", fixture.replace("$._kw_display,", "optional($._kw_display),")),
      testCase("non-keyword marker", fixture.replace("$._kw_display,", "$.display,")),
      testCase(
        "no following payload",
        fixture.replace(
          /      choice\(\$\.__browse_columns[^\n]*\n      optional\(\$\.__browse_body_tail\),\n/,
          "",
        ),
      ),
      ...[
        "$.identifier",
        'optional(field("query", $.identifier))',
        'field("query", optional($.identifier))',
        "field(name, $.identifier)",
      ].map((replacement) =>
        testCase(
          `unsupported preceding field: ${replacement}`,
          fixture.replace('field("query", $.identifier)', replacement),
        ),
      ),
      ...["token", "token.immediate", "custom"].map((wrapper) =>
        testCase(`unsafe wrapper: ${wrapper}`, wrapBody(wrapper)),
      ),
      testCase("dynamic precedence", wrapBody("prec.dynamic", "1, ")),
      testCase("non-static precedence", wrapBody("prec.right", "binding, ")),
      testCase("field wrapper", wrapBody("field", '"outer", ')),
      testCase("dynamic reference", `${fixture}\nconst unknown = ($) => $[name];`),
      testCase("computed reference", fixture.replace("$._kw_query", '$["_kw_query"]')),
      testCase("non-rule reference", `${fixture}\nconst reference = ($) => $.__browse_body;`),
      testCase(
        "aliased owner",
        fixture.replace(
          "__browse_body:",
          "outer: ($) => alias($.__browse_body, $.body),\n__browse_body:",
        ),
      ),
      testCase(
        "lexical owner",
        fixture.replace("__browse_body:", "outer: ($) => token($.__browse_body),\n__browse_body:"),
      ),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras", "word"].map(
        (metadata) => testCase(`${metadata} metadata`, metadataCase(metadata)),
      ),
      ...[
        "__browse_body:",
        "seq(",
        'field("query",',
        first,
        family,
        'kw("EXCLUSIVE-LOCK")',
        second,
        single,
        "$._kw_display,",
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          fixture.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/optional-flag-pair-extraction\n${part}`,
          ),
        ),
      ),
    ],
    invalid: [
      { ...testCase("measured BROWSE lock and wait flags"), errors: [{ message }] },
      {
        ...testCase(
          "renamed flags and fields",
          fixture
            .replaceAll("LOCK", "ACCESS")
            .replaceAll("lock", "access")
            .replaceAll("NO-WAIT", "DEFERRED")
            .replaceAll("no_wait", "deferred")
            .replaceAll("query", "source"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "shared keyword symbols",
          fixture
            .replace('kw("SHARE-LOCK")', "$._kw_share_lock")
            .replace('kw("EXCLUSIVE-LOCK")', "$._kw_exclusive_lock")
            .replace('kw("NO-WAIT")', "$._kw_no_wait"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static keyword options",
          fixture.replace('kw("NO-WAIT")', 'kw("NO-WAIT", { offset: 6 })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("direct marker keyword", fixture.replace("$._kw_display", 'kw("DISPLAY")')),
        errors: [{ message }],
      },
      {
        ...testCase("static caller precedence", wrapBody("prec.right")),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          fixture.replace(
            first,
            `\n// oxlint-disable-next-line tree-sitter-optimize/shared-choice\n${first}`,
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "statements", "browse.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const metadata of ["inline", "conflicts", "supertypes", "externals", "extras"]) {
    writeFileSync(
      join(directory, "grammar.js"),
      `export default grammar({ ${metadata}: ($) => [$.__browse_body] });`,
    );
    new RuleTester().run("optional-flag-pair-extraction", optionalFlagPairExtraction, {
      valid: [moduleCase(`${metadata} dependency in project root`)],
      invalid: [],
    });
  }
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.__browse_body, $.other]];",
  );
  new RuleTester().run("optional-flag-pair-extraction", optionalFlagPairExtraction, {
    valid: [moduleCase("precedence dependency in another module")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $.__browse_body is documentation.\nexport default ($) => [["__browse_body", $.other]];',
  );
  new RuleTester().run("optional-flag-pair-extraction", optionalFlagPairExtraction, {
    valid: [],
    invalid: [{ ...moduleCase("comments and strings are not metadata"), errors: [{ message }] }],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
