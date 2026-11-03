import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { multiUsePrivateKeywordOptionalTailInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-private-keyword-optional-tail-"));
const sequence = 'seq(kw("WITH", { offset: 2 }), optional($.__items))';
const before = `export default grammar({ rules: {
  first: ($) => seq("A", optional($.__clause)),
  second: ($) => prec.right(seq("B", $.__clause)),
  __clause: ($) => ${sequence},
  __items: ($) => prec.right(seq($.item, optional($.__items))),
} });`;
const fixture = readFileSync(
  new URL("./fixtures/browse-options-inline.js", import.meta.url),
  "utf8",
);
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /unaliased local uses.*keyword followed by an optional hidden tail.*grammar.inline.*cross-file uses and metadata.*keyword identity, tail fields and aliases, caller optionality and precedence.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run(
    "multi-use-private-keyword-optional-tail-inline",
    multiUsePrivateKeywordOptionalTailInline,
    {
      valid: [
        testCase("public helper", before.replaceAll("__clause", "clause")),
        testCase("shared helper", before.replaceAll("__clause", "_clause")),
        testCase("single use", before.replace("optional($.__clause)", "$.item")),
        testCase("unused helper", before.replaceAll("$.__clause", "$.item")),
        ...[
          'seq("WITH", optional($.__items))',
          'seq(alias(kw("WITH"), $.with), optional($.__items))',
          'seq(field("mode", kw("WITH")), optional($.__items))',
          "seq(kw(keyword), optional($.__items))",
          'seq(kw("WITH"), $.__items)',
          'seq(kw("WITH"), optional($.items))',
          'seq(kw("WITH"), optional(seq($.__items, $.other)))',
          'seq(kw("WITH"), optional($.__items), $.other)',
          'seq(optional(kw("WITH")), optional($.__items))',
          `prec.right(${sequence})`,
          `token(${sequence})`,
        ].map((body) => testCase(`unsupported body: ${body}`, before.replace(sequence, body))),
        testCase(
          "direct recursion",
          before.replace("optional($.__items))", "optional($.__clause))"),
        ),
        testCase("indirect recursion", before.replace("seq($.item,", "seq($.__clause,")),
        testCase("unknown tail definition", before.replace("__items: ($)", "__other: ($)")),
        testCase(
          "dynamic tail definition",
          before.replace("prec.right(seq($.item, optional($.__items)))", "buildTail($)"),
        ),
        ...[
          "alias($.__clause, $.clause)",
          'field("outer", $.__clause)',
          "token($.__clause)",
          "token.immediate($.__clause)",
          "prec.dynamic(1, $.__clause)",
          "prec.right(binding, $.__clause)",
          "custom($.__clause)",
          'alias(seq($.__clause, "."), $.clause)',
          '$["__clause"]',
          "$[name]",
        ].map((use) =>
          testCase(`unsafe local use: ${use}`, before.replace("optional($.__clause)", use)),
        ),
        testCase("non-rule reference", `${before}\nconst reference = ($) => $.__clause;`),
        ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].map(
          (metadata) =>
            testCase(
              `${metadata} dependency`,
              before.replace(
                "grammar({ rules:",
                `grammar({ ${metadata}: ($) => [$.__clause], rules:`,
              ),
            ),
        ),
        testCase(
          "word dependency",
          before.replace("grammar({ rules:", "grammar({ word: ($) => $.__clause, rules:"),
        ),
        ...[
          "__clause:",
          sequence,
          'kw("WITH",',
          "optional($.__items)",
          "first:",
          "optional($.__clause)",
        ].map((part) =>
          testCase(
            `rule-specific suppression at ${part}`,
            before.replace(
              part,
              `\n// oxlint-disable-next-line rule-to-test/multi-use-private-keyword-optional-tail-inline\n${part}`,
            ),
          ),
        ),
        testCase(
          "measured helper after metadata inlining",
          fixture.replace("grammar({", "grammar({ inline: ($) => [$.__browse_options_phrase],"),
        ),
      ],
      invalid: [
        {
          ...testCase("keyword with optional recursive tail"),
          errors: [{ message }],
        },
        {
          ...testCase("measured BROWSE options helper", fixture),
          errors: [{ message }],
        },
        {
          ...testCase(
            "renamed helper and tail",
            before.replaceAll("__clause", "__option_prefix").replaceAll("__items", "__options"),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "shared keyword symbol",
            before.replace('kw("WITH", { offset: 2 })', "$._kw_with"),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "static caller precedence and repetition",
            before.replace(
              'seq("A", optional($.__clause))',
              'prec.left("items", repeat1($.__clause))',
            ),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "unrelated suppression",
            before.replace(
              "__clause:",
              "// oxlint-disable-next-line tree-sitter-optimize/single-use-sequence\n__clause:",
            ),
          ),
          errors: [{ message }],
        },
      ],
    },
  );

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "statements", "demo.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__clause] });",
  );
  new RuleTester().run(
    "multi-use-private-keyword-optional-tail-inline",
    multiUsePrivateKeywordOptionalTailInline,
    {
      valid: [moduleCase("inline metadata in project root")],
      invalid: [],
    },
  );
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.__clause, $.other]];",
  );
  new RuleTester().run(
    "multi-use-private-keyword-optional-tail-inline",
    multiUsePrivateKeywordOptionalTailInline,
    {
      valid: [moduleCase("precedence dependency in another module")],
      invalid: [],
    },
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $.__clause is documentation.\nexport default ($) => [["__clause", $.other]];',
  );
  new RuleTester().run(
    "multi-use-private-keyword-optional-tail-inline",
    multiUsePrivateKeywordOptionalTailInline,
    {
      valid: [],
      invalid: [
        {
          ...moduleCase("comments and strings do not add dependencies"),
          errors: [{ message }],
        },
      ],
    },
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
