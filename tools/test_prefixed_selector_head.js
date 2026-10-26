import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { prefixedSelectorHeadExtraction } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-prefixed-selector-head-"));
const selector = 'choice(kw("TABLE"), $._kw_view)';
const field = 'field("target", $.identifier)';
const sequence = `seq($._kw_drop, ${selector}, ${field}, $._terminator)`;
const before = `export default grammar({ rules: { demo: ($) => ${sequence} } });`;
const fixture = readFileSync(new URL("./fixtures/create-socket-head.js", import.meta.url), "utf8");
const testCase = (name, code) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /fixed keyword.*required .* field.*only the prefix and complete selector into a hidden head.*field and suffix at the caller.*token identity.*ACTION_COUNT, Wasm memory and parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("prefixed-selector-head-extraction", prefixedSelectorHeadExtraction, {
    valid: [
      testCase(
        "already extracted head leaves field at caller",
        `export default grammar({ rules: {
          demo: ($) => seq($.__demo_head, ${field}, $._terminator),
          __demo_head: ($) => seq($._kw_drop, ${selector}),
        } });`,
      ),
      testCase("no leading keyword", before.replace("$._kw_drop, ", "")),
      testCase("value prefix", before.replace("$._kw_drop", "$.expression")),
      testCase("optional prefix", before.replace("$._kw_drop", "optional($._kw_drop)")),
      testCase("no suffix", before.replace(", $._terminator", "")),
      testCase("one selector branch", before.replace(", $._kw_view", "")),
      testCase("valued selector", before.replace("$._kw_view", "$.expression")),
      testCase("duplicate selector branches", before.replace("$._kw_view", 'kw("TABLE")')),
      testCase("aliased selector", before.replace(selector, `alias(${selector}, $.kind)`)),
      testCase("optional field", before.replace(field, `optional(${field})`)),
      testCase("nullable field body", before.replace("$.identifier", "optional($.identifier)")),
      testCase("no field", before.replace(field, "$.identifier")),
      testCase("keyword field", before.replace("$.identifier", "$._kw_name")),
      testCase("dynamic field name", before.replace('"target"', "fieldName")),
      testCase("dynamic keyword", before.replace('kw("TABLE")', "kw(tableName)")),
      testCase("dynamic selector", before.replace("$._kw_view", "...keywords")),
      testCase("recursive owner", before.replace("$._terminator", "optional($.demo)")),
      testCase("lexical suffix", before.replace("$._terminator", "token(/[a-z]+/)")),
      testCase(
        "dynamic precedence suffix",
        before.replace("$._terminator", "prec.dynamic(1, $.tail)"),
      ),
      ...["alias", "field", "token", "token.immediate", "prec.dynamic"].map((wrapper) =>
        testCase(
          `unsupported ${wrapper} scope`,
          before.replace(
            sequence,
            wrapper === "alias"
              ? `alias(${sequence}, $.body)`
              : wrapper === "field"
                ? `field("body", ${sequence})`
                : wrapper === "prec.dynamic"
                  ? `prec.dynamic(1, ${sequence})`
                  : `${wrapper}(${sequence})`,
          ),
        ),
      ),
      ...["inline", "conflicts", "externals", "supertypes", "precedences", "extras"].map(
        (metadata) =>
          testCase(
            `${metadata} restriction`,
            before.replace("grammar({ rules:", `grammar({ ${metadata}: ($) => [$.demo], rules:`),
          ),
      ),
      testCase(
        "word restriction",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $.demo, rules:"),
      ),
      testCase(
        "computed metadata",
        before.replace("grammar({ rules:", 'grammar({ inline: ($) => [$["demo"]], rules:'),
      ),
      testCase(
        "dynamic metadata",
        before.replace("grammar({ rules:", "grammar({ inline: ($) => [$[ruleName]], rules:"),
      ),
      ...["demo:", sequence, selector, "$._kw_drop", "$._kw_view", field].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/prefixed-selector-head-extraction\n${part}`,
          ),
        ),
      ),
    ],
    invalid: [
      { ...testCase("keyword family before a required field", before), errors: [{ message }] },
      { ...testCase("measured CREATE SOCKET shape", fixture), errors: [{ message }] },
      {
        ...testCase("inline leading keyword", before.replace("$._kw_drop", 'kw("DROP")')),
        errors: [{ message }],
      },
      {
        ...testCase(
          "keyword abbreviation options",
          before.replace('kw("TABLE")', 'kw("TABLE", { offset: 3 })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "larger selector",
          before.replace("$._kw_view", '$._kw_view, kw("INDEX"), kw("SCHEMA")'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "compound suffix stays outside",
          before.replace("$._terminator", "optional($.flag), seq($.tail, $._terminator)"),
        ),
        errors: [{ message }],
      },
      ...["prec", "prec.left", "prec.right"].map((wrapper) => ({
        ...testCase(
          `preserve ${wrapper} scope`,
          before.replace(sequence, `${wrapper}("statement", ${sequence})`),
        ),
        errors: [{ message }],
      })),
      {
        ...testCase(
          "nested statement branch",
          before.replace(sequence, `choice(${sequence}, $.other)`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            "demo:",
            "\n// oxlint-disable-next-line tree-sitter-optimize/recurse\ndemo:",
          ),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("metadata in comments is ignored", `// inline: ($) => [$.demo]\n${before}`),
        errors: [{ message }],
      },
    ],
  });

  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const metadata of [
    "inline",
    "conflicts",
    "precedences",
    "supertypes",
    "externals",
    "extras",
  ]) {
    writeFileSync(
      join(directory, "grammar.js"),
      `export default grammar({ ${metadata}: ($) => [$.demo], rules: {} });`,
    );
    new RuleTester().run(
      `prefixed-selector-head-extraction external ${metadata}`,
      prefixedSelectorHeadExtraction,
      {
        valid: [
          {
            ...testCase("external owner metadata", before),
            filename: join(directory, "grammar", "demo.js"),
          },
        ],
        invalid: [],
      },
    );
  }
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.demo, $.other]];",
  );
  new RuleTester().run(
    "prefixed-selector-head-extraction external precedence file",
    prefixedSelectorHeadExtraction,
    {
      valid: [testCase("external owner precedence", before)],
      invalid: [],
    },
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
