import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { sharedOrderedPairInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-shared-ordered-pair-"));
const pair = "choice(seq($.opening_clause, optional($.closing_clause)), $.closing_clause)";
const before = `export default grammar({ rules: {
  first: ($) => seq("A", $._pair),
  second: ($) => prec.right(seq("B", optional($._pair))),
  _pair: ($) => ${pair},
} });`;
const fixture = readFileSync(
  new URL("./fixtures/selection-pair-inline.js", import.meta.url),
  "utf8",
);
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /non-empty ordered pair.*either node alone or both in order.*grammar.inline.*cross-file use.*fields, aliases and metadata.*named nodes, alternative order and caller optionality.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("shared-ordered-pair-inline", sharedOrderedPairInline, {
    valid: [
      testCase("public helper", before.replaceAll("_pair", "pair")),
      testCase("private helper", before.replaceAll("_pair", "__pair")),
      ...[
        "seq($.opening_clause, optional($.closing_clause))",
        "choice(seq($.opening_clause, $.closing_clause), $.closing_clause)",
        "choice(seq($.opening_clause, optional($.other_clause)), $.closing_clause)",
        "choice(seq($.opening_clause, optional($.closing_clause)), $.opening_clause)",
        "choice(seq($.opening_clause, optional($.closing_clause)), $.closing_clause, $.other_clause)",
        "choice(seq($.opening_clause, optional($.closing_clause), $.other_clause), $.closing_clause)",
        "choice(seq(optional($.opening_clause), optional($.closing_clause)), $.closing_clause)",
        "choice(seq($._opening_clause, optional($.closing_clause)), $.closing_clause)",
        "choice(seq($.opening_clause, optional($._closing_clause)), $._closing_clause)",
        "choice(seq($.closing_clause, optional($.closing_clause)), $.closing_clause)",
        'choice(seq(field("first", $.opening_clause), optional($.closing_clause)), $.closing_clause)',
        'choice(seq(kw("OPEN"), optional($.closing_clause)), $.closing_clause)',
        `prec.right(${pair})`,
        `token(${pair})`,
      ].map((body) => testCase(`unsupported body: ${body}`, before.replace(pair, body))),
      ...[
        "alias($._pair, $.pair)",
        'field("outer", $._pair)',
        "token($._pair)",
        "token.immediate($._pair)",
        "prec.dynamic(1, $._pair)",
        "prec.right(binding, $._pair)",
        "custom($._pair)",
        'alias(seq($._pair, "."), $.pair)',
        '$["_pair"]',
        "$[name]",
      ].map((use) =>
        testCase(`unsafe local use: ${use}`, before.replace('seq("A", $._pair)', use)),
      ),
      testCase("non-rule reference", `${before}\nconst reference = ($) => $._pair;`),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].map(
        (metadata) =>
          testCase(
            `${metadata} dependency`,
            before.replace("grammar({ rules:", `grammar({ ${metadata}: ($) => [$._pair], rules:`),
          ),
      ),
      testCase(
        "word dependency",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $._pair, rules:"),
      ),
      ...[
        "_pair:",
        pair,
        "seq($.opening_clause",
        "optional($.closing_clause)",
        "first:",
        'seq("A",',
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/shared-ordered-pair-inline\n${part}`,
          ),
        ),
      ),
      testCase(
        "measured selection helper after metadata inlining",
        fixture.replace("grammar({", "grammar({ inline: ($) => [$._selection_after_for],"),
      ),
    ],
    invalid: [
      { ...testCase("shared ordered pair"), errors: [{ message }] },
      { ...testCase("measured selection helper", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed helper and node pair",
          before
            .replaceAll("_pair", "_clauses")
            .replaceAll("opening_clause", "prefix")
            .replaceAll("closing_clause", "suffix"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "shared declaration consumed in other modules",
          `export default ({ kw }) => ({ _pair: ($) => ${pair} });`,
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "one local consumer",
          before.replace('second: ($) => prec.right(seq("B", optional($._pair))),', ""),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static caller precedence and repetition",
          before.replace('seq("A", $._pair)', 'prec.left("items", repeat1($._pair))'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            "_pair:",
            "// oxlint-disable-next-line tree-sitter-optimize/single-use-shared-choice-inline\n_pair:",
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "core", "common.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$._pair] });",
  );
  new RuleTester().run("shared-ordered-pair-inline", sharedOrderedPairInline, {
    valid: [moduleCase("inline metadata in project root")],
    invalid: [],
  });
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$._pair, $.other]];",
  );
  new RuleTester().run("shared-ordered-pair-inline", sharedOrderedPairInline, {
    valid: [moduleCase("precedence dependency in another module")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $._pair is documentation.\nexport default ($) => [["_pair", $.other]];',
  );
  new RuleTester().run("shared-ordered-pair-inline", sharedOrderedPairInline, {
    valid: [],
    invalid: [
      { ...moduleCase("comments and strings do not add dependencies"), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
