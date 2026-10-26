import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { privatePrecedenceOrderedPairInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-private-precedence-pair-"));
const ordered = "choice(seq($.opening_clause, optional($._closing_clause)), $._closing_clause)";
const body = `prec.right(${ordered})`;
const before = `export default grammar({ rules: {
  first: ($) => seq("A", optional($.__pair)),
  second: ($) => prec.right(seq("B", $.__pair)),
  __pair: ($) => ${body},
} });`;
const fixture = readFileSync(
  new URL("./fixtures/format-view-tail-inline.js", import.meta.url),
  "utf8",
);
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /unaliased local uses.*ordered symbol pair under static precedence.*grammar.inline.*complete precedence chain.*symbol definitions, fields, aliases, alternative order and caller optionality.*cross-file uses and metadata.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run(
    "private-precedence-ordered-pair-inline",
    privatePrecedenceOrderedPairInline,
    {
      valid: [
        testCase("public helper", before.replaceAll("__pair", "pair")),
        testCase("shared helper", before.replaceAll("__pair", "_pair")),
        testCase("one local use", before.replace("optional($.__pair)", "$.item")),
        testCase("unused helper", before.replaceAll("$.__pair", "$.item")),
        ...[
          ordered,
          `prec.dynamic(1, ${ordered})`,
          `prec.right(binding, ${ordered})`,
          `prec.right(1, 2, ${ordered})`,
          `prec(${ordered})`,
          `token(${body})`,
          "prec.right(seq($.opening_clause, optional($._closing_clause)))",
          "prec.right(choice(seq($.opening_clause, $._closing_clause), $._closing_clause))",
          "prec.right(choice(seq($.opening_clause, optional($.other)), $._closing_clause))",
          "prec.right(choice(seq($.opening_clause, optional($._closing_clause)), $.opening_clause))",
          "prec.right(choice(seq($.opening_clause, optional($._closing_clause)), $._closing_clause, $.other))",
          "prec.right(choice(seq($.opening_clause, optional($._closing_clause), $.other), $._closing_clause))",
          "prec.right(choice(seq(optional($.opening_clause), optional($._closing_clause)), $._closing_clause))",
          "prec.right(choice(seq($._closing_clause, optional($._closing_clause)), $._closing_clause))",
          'prec.right(choice(seq(field("first", $.opening_clause), optional($._closing_clause)), $._closing_clause))',
          'prec.right(choice(seq(kw("OPEN"), optional($._closing_clause)), $._closing_clause))',
          "prec.right(choice(seq(alias($.opening_clause, $.opening), optional($._closing_clause)), $._closing_clause))",
        ].map((replacement) =>
          testCase(`unsupported body: ${replacement}`, before.replace(body, replacement)),
        ),
        testCase("direct recursion", before.replace("seq($.opening_clause", "seq($.__pair")),
        testCase(
          "indirect recursion",
          before.replace("__pair:", "opening_clause: ($) => $.__pair,\n__pair:"),
        ),
        testCase(
          "dynamic local dependency",
          before.replace("__pair:", "opening_clause: ($) => buildOpening($),\n__pair:"),
        ),
        ...[
          "alias($.__pair, $.pair)",
          'field("outer", $.__pair)',
          "token($.__pair)",
          "token.immediate($.__pair)",
          "prec.dynamic(1, $.__pair)",
          "prec.right(binding, $.__pair)",
          "custom($.__pair)",
          'alias(seq($.__pair, "."), $.pair)',
          '$["__pair"]',
          "$[name]",
        ].map((use) => testCase(`unsafe use: ${use}`, before.replace("optional($.__pair)", use))),
        testCase("non-rule reference", `${before}\nconst reference = ($) => $.__pair;`),
        ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].map(
          (metadata) =>
            testCase(
              `${metadata} dependency`,
              before.replace(
                "grammar({ rules:",
                `grammar({ ${metadata}: ($) => [$.__pair], rules:`,
              ),
            ),
        ),
        testCase(
          "word dependency",
          before.replace("grammar({ rules:", "grammar({ word: ($) => $.__pair, rules:"),
        ),
        ...[
          "__pair:",
          body,
          ordered,
          "seq($.opening_clause",
          "optional($._closing_clause)",
          "first:",
          "optional($.__pair)",
        ].map((part) =>
          testCase(
            `rule-specific suppression at ${part}`,
            before.replace(
              part,
              `\n// oxlint-disable-next-line rule-to-test/private-precedence-ordered-pair-inline\n${part}`,
            ),
          ),
        ),
        testCase(
          "measured helper after metadata inlining",
          fixture.replace("grammar({", "grammar({ inline: ($) => [$.__format_view_as_tail],"),
        ),
      ],
      invalid: [
        { ...testCase("private ordered pair with right associativity"), errors: [{ message }] },
        { ...testCase("measured format VIEW-AS tail", fixture), errors: [{ message }] },
        {
          ...testCase(
            "renamed helper and symbols",
            before
              .replaceAll("__pair", "__tail")
              .replaceAll("opening_clause", "first_node")
              .replaceAll("_closing_clause", "_last_node"),
          ),
          errors: [{ message }],
        },
        ...[
          `prec.left(${ordered})`,
          `prec("binding", ${ordered})`,
          `prec.right("binding", ${ordered})`,
          `prec.left(1, prec.right("binding", ${ordered}))`,
        ].map((replacement) => ({
          ...testCase(`static precedence: ${replacement}`, before.replace(body, replacement)),
          errors: [{ message }],
        })),
        {
          ...testCase("two public symbols", before.replaceAll("_closing_clause", "closing_clause")),
          errors: [{ message }],
        },
        {
          ...testCase("two hidden symbols", before.replaceAll("opening_clause", "_opening_clause")),
          errors: [{ message }],
        },
        {
          ...testCase(
            "retained recursive child",
            before.replace(
              "__pair:",
              "_closing_clause: ($) => seq($.item, optional($._closing_clause)),\n__pair:",
            ),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "static caller precedence and repetition",
            before.replace('seq("A", optional($.__pair))', 'prec.left("items", repeat1($.__pair))'),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "unrelated suppression",
            before.replace(
              "__pair:",
              "// oxlint-disable-next-line tree-sitter-optimize/single-use-choice\n__pair:",
            ),
          ),
          errors: [{ message }],
        },
      ],
    },
  );

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "phrases", "demo.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__pair] });",
  );
  new RuleTester().run(
    "private-precedence-ordered-pair-inline",
    privatePrecedenceOrderedPairInline,
    {
      valid: [moduleCase("inline metadata in project root")],
      invalid: [],
    },
  );
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.__pair, $.other]];",
  );
  new RuleTester().run(
    "private-precedence-ordered-pair-inline",
    privatePrecedenceOrderedPairInline,
    {
      valid: [moduleCase("precedence dependency in another module")],
      invalid: [],
    },
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $.__pair is documentation.\nexport default ($) => [["__pair", $.other]];',
  );
  new RuleTester().run(
    "private-precedence-ordered-pair-inline",
    privatePrecedenceOrderedPairInline,
    {
      valid: [],
      invalid: [
        { ...moduleCase("comments and strings do not add dependencies"), errors: [{ message }] },
      ],
    },
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
