import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { keywordOptionalMarkerPrefix } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-keyword-optional-marker-"));
const fixture = readFileSync(
  new URL("./fixtures/copy-lob-keyword-prefix.js", import.meta.url),
  "utf8",
);
const head = 'kw("COPY-LOB")',
  marker = "optional($._kw_from)",
  operand = "$.__copy_lob_source",
  sourceField = 'field("source", $._expression)';
const testCase = (name, code = fixture, cwd = directory) => ({
  name,
  code,
  cwd,
  filename: join(cwd, "grammar.js"),
});
const message =
  /keyword and optional keyword marker.*hidden operand selector.*only those two keywords.*non-empty hidden prefix.*operand selector and suffix at the caller.*recovery field attachment.*token identities.*metadata.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;
const metadataCase = (metadata) =>
  fixture
    .replace(
      "export default ({ kw }) => ({",
      `export default grammar({ ${metadata}: ($) => [$.__copy_lob_prefix], rules: {`,
    )
    .replace("\n});", "\n} });");
const replaceCaller = (value) => fixture.replace("seq($.__copy_lob_prefix,", `seq(${value},`);

try {
  new RuleTester().run("keyword-optional-marker-prefix", keywordOptionalMarkerPrefix, {
    valid: [
      testCase(
        "measured keyword-only prefix",
        fixture
          .replace(`${head},\n      ${marker}`, "$.__copy_lob_keyword_prefix")
          .replace(
            "  __copy_lob_source:",
            `  __copy_lob_keyword_prefix: ($) => seq(${head}, ${marker}),\n  __copy_lob_source:`,
          ),
      ),
      ...[
        "$.prefix",
        'alias(kw("COPY-LOB"), $.copy_lob)',
        'field("keyword", kw("COPY-LOB"))',
        "kw(command)",
        'kw("COPY-LOB", options)',
        'kw("COPY-LOB", { offset: minimum })',
      ].map((replacement) =>
        testCase(`unsupported head: ${replacement}`, fixture.replace(head, replacement)),
      ),
      ...[
        "$._kw_from",
        "optional($.from)",
        "optional(alias($._kw_from, $.from))",
        "optional(choice($._kw_from, $._kw_source))",
        "optional($._kw_from, $._kw_source)",
        "repeat($._kw_from)",
        `optional(${head})`,
      ].map((replacement) =>
        testCase(`unsupported marker: ${replacement}`, fixture.replace(marker, replacement)),
      ),
      ...["$.source", "$.__missing", `optional(${operand})`, `field("source", ${operand})`].map(
        (replacement) =>
          testCase(`unsupported selector: ${replacement}`, fixture.replace(operand, replacement)),
      ),
      testCase("public owner", fixture.replaceAll("__copy_lob_prefix", "copy_lob_prefix")),
      testCase("recursive owner", fixture.replace("$.__copy_lob_target", "$.__copy_lob_prefix")),
      testCase("recursive selector", fixture.replace(sourceField, `field("source", ${operand})`)),
      testCase(
        "selector returns to owner",
        fixture.replace(sourceField, 'field("source", $.__copy_lob_prefix)'),
      ),
      testCase(
        "no optional selector marker",
        fixture.replace("optional($._kw_object)", "$._kw_object"),
      ),
      testCase("non-keyword selector marker", fixture.replace("$._kw_file", "$.file")),
      testCase(
        "aliased selector marker",
        fixture.replace("$._kw_file", "alias($._kw_file, $.file)"),
      ),
      ...[
        "$._expression",
        "field(name, $._expression)",
        'field("source", optional($._expression))',
        'field("source", alias($._expression, $.source))',
        'field("source", $._kw_source)',
      ].map((replacement) =>
        testCase(
          `unsupported selector value: ${replacement}`,
          fixture.replace(sourceField, replacement),
        ),
      ),
      testCase(
        "one selector branch",
        fixture.replace('      seq($._kw_file, field("source_file", $._expression)),\n', ""),
      ),
      testCase(
        "nullable selector branch",
        fixture.replace(
          'seq($._kw_file, field("source_file", $._expression))',
          "optional($._kw_file)",
        ),
      ),
      testCase(
        "no required suffix",
        fixture.replace("      $._kw_to,\n      $.__copy_lob_target,\n", ""),
      ),
      testCase("no local caller", fixture.replace(/  copy_lob_statement:[^\n]+\n/, "")),
      ...[
        "alias($.__copy_lob_prefix, $.body)",
        'field("body", $.__copy_lob_prefix)',
        "token($.__copy_lob_prefix)",
        "token.immediate($.__copy_lob_prefix)",
        "prec.dynamic(1, $.__copy_lob_prefix)",
        "prec.right(binding, $.__copy_lob_prefix)",
        "custom($.__copy_lob_prefix)",
      ].map((replacement) => testCase(`unsafe caller: ${replacement}`, replaceCaller(replacement))),
      testCase(
        "dynamic suffix",
        fixture.replace("$.__copy_lob_target", "prec.dynamic(1, $.__copy_lob_target)"),
      ),
      testCase("dynamic reference", `${fixture}\nconst unknown = ($) => $[name];`),
      testCase("computed marker", fixture.replace("$._kw_from", '$["_kw_from"]')),
      testCase("external reference", `${fixture}\nconst reference = ($) => $.__copy_lob_prefix;`),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras", "word"].map(
        (metadata) => testCase(`${metadata} metadata`, metadataCase(metadata)),
      ),
      ...[
        "__copy_lob_prefix:",
        "seq(\n",
        head,
        marker,
        "$._kw_from",
        `${operand},`,
        "__copy_lob_source:",
        "choice(\n",
        "optional($._kw_object)",
        sourceField,
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          fixture.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/keyword-optional-marker-prefix\n${part}`,
          ),
        ),
      ),
    ],
    invalid: [
      { ...testCase("measured COPY-LOB prefix"), errors: [{ message }] },
      {
        ...testCase(
          "different command and operand fields",
          fixture
            .replaceAll("copy_lob", "transfer")
            .replaceAll("COPY-LOB", "TRANSFER")
            .replaceAll("source", "input"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("shared head keyword", fixture.replace(head, "$._kw_copy_lob")),
        errors: [{ message }],
      },
      {
        ...testCase("direct optional marker", fixture.replace("$._kw_from", 'kw("FROM")')),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static keyword options",
          fixture.replace(head, 'kw("COPY-LOB", { offset: 6 })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static caller precedence",
          replaceCaller('prec.right("statement", $.__copy_lob_prefix)'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          fixture.replace(
            marker,
            `\n// oxlint-disable-next-line tree-sitter-optimize/shared-choice\n${marker}`,
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  for (const metadata of [
    "inline",
    "conflicts",
    "precedences",
    "supertypes",
    "externals",
    "extras",
    "word",
  ]) {
    const project = join(directory, metadata);
    mkdirSync(join(project, "grammar"), { recursive: true });
    writeFileSync(
      join(project, "grammar.js"),
      `export default grammar({ ${metadata}: ($) => [$.__copy_lob_prefix] });`,
    );
    new RuleTester().run(
      `keyword-optional-marker-prefix root ${metadata}`,
      keywordOptionalMarkerPrefix,
      {
        valid: [
          {
            ...testCase(`root ${metadata}`, fixture, project),
            filename: join(project, "grammar", "copy-lob.js"),
          },
        ],
        invalid: [],
      },
    );
  }
  const project = join(directory, "precedence-module");
  mkdirSync(join(project, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(project, "grammar", "precedences", "copy-lob.js"),
    "export default ($) => [[$.__copy_lob_prefix, $.identifier]];",
  );
  new RuleTester().run(
    "keyword-optional-marker-prefix precedence module",
    keywordOptionalMarkerPrefix,
    {
      valid: [
        {
          ...testCase("precedence dependency", fixture, project),
          filename: join(project, "grammar", "copy-lob.js"),
        },
      ],
      invalid: [],
    },
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
