import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { leftRecursiveOptionList } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-left-recursive-options-"));
const body = "prec.right(seq($.__item, optional($.__items)))";
const options = "choice($.__valued, $._kw_flag)";
const before = `export default grammar({ rules: {
  phrase: ($) => $.__items,
  __items: ($) => ${body},
  __item: ($) => ${options},
  __valued: ($) => seq($._kw_value, field("value", $.identifier)),
} });`;
const fixture = readFileSync(
  new URL("./fixtures/right-recursive-format-options.js", import.meta.url),
  "utf8",
);
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /right-recursive option list behind the public forwarding rule.*seq\(optional\(.*list's right associativity.*prec.right.*greedy option attachment.*item alternatives, fields, aliases, order and one-item minimum.*cross-file uses and metadata.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("left-recursive-option-list", leftRecursiveOptionList, {
    valid: [
      testCase("public list", before.replaceAll("__items", "items")),
      testCase("shared list", before.replaceAll("__items", "_items")),
      testCase(
        "public option",
        before.replaceAll("__item:", "item:").replaceAll("$.__item,", "$.item,"),
      ),
      testCase(
        "shared option",
        before.replaceAll("__item:", "_item:").replaceAll("$.__item,", "$._item,"),
      ),
      testCase("hidden wrapper", before.replace("phrase:", "__phrase:")),
      testCase("no wrapper", before.replace("phrase: ($) => $.__items,", "")),
      testCase("multiple wrappers", before.replace("phrase:", "second: ($) => $.__items, phrase:")),
      testCase("non-rule use", `${before}\nconst reference = ($) => $.__items;`),
      testCase("computed reference", `${before}\nconst reference = ($) => $["__items"];`),
      testCase("dynamic reference", `${before}\nconst reference = ($) => $[name];`),
      testCase("computed definition", before.replace("__items:", '["__items"]:')),
      testCase("spread rule definitions", before.replace("rules: {", "rules: { ...other,")),
      ...[
        "seq($.__item, optional($.__items))",
        "prec.left(seq($.__item, optional($.__items)))",
        "prec.right(1, seq($.__item, optional($.__items)))",
        'prec.right("items", seq($.__item, optional($.__items)))',
        "prec.dynamic(1, seq($.__item, optional($.__items)))",
        "prec.right(seq(optional($.__items), $.__item))",
        "prec.right(seq($.__item, $.__items))",
        "prec.right(seq($.__item, optional($.__other)))",
        'prec.right(seq($.__item, ",", optional($.__items)))',
        'prec.right(seq($.__item, optional(seq(",", $.__items))))',
        'prec.right(seq(field("item", $.__item), optional($.__items)))',
        "prec.right(seq(alias($.__item, $.item), optional($.__items)))",
        "prec.right(seq($.__item, optional($.__items, $.other)))",
        "token(prec.right(seq($.__item, optional($.__items))))",
        "prec.right(seq(...items, optional($.__items)))",
      ].map((replacement) =>
        testCase(`unsupported list: ${replacement}`, before.replace(body, replacement)),
      ),
      ...[
        "prec.left($.__items)",
        "prec.right(1, $.__items)",
        "prec.dynamic(1, $.__items)",
        'field("items", $.__items)',
        "alias($.__items, $.items)",
        "token($.__items)",
        "token.immediate($.__items)",
        'seq("START", $.__items)',
        "optional($.__items)",
      ].map((replacement) =>
        testCase(
          `unsupported wrapper: ${replacement}`,
          before.replace("phrase: ($) => $.__items", `phrase: ($) => ${replacement}`),
        ),
      ),
      ...[
        "$.__valued",
        "choice($.__valued)",
        "choice($.__valued, $.__other)",
        "choice($._kw_first, $._kw_second)",
        'choice($.__valued, kw("FLAG"))',
        'choice(field("value", $.__valued), $._kw_flag)',
        "choice(alias($.__valued, $.value), $._kw_flag)",
        "choice(token($.__valued), $._kw_flag)",
        "choice(...values, $._kw_flag)",
        "choice($.__items, $._kw_flag)",
        "choice($.phrase, $._kw_flag)",
      ].map((replacement) =>
        testCase(`unsupported option: ${replacement}`, before.replace(options, replacement)),
      ),
      testCase(
        "indirect list recursion",
        before.replace('seq($._kw_value, field("value", $.identifier))', "$.__items"),
      ),
      testCase(
        "indirect wrapper recursion",
        before.replace('seq($._kw_value, field("value", $.identifier))', "$.phrase"),
      ),
      testCase(
        "dynamic dependency",
        before.replace('seq($._kw_value, field("value", $.identifier))', "buildOption($)"),
      ),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].flatMap(
        (metadata) =>
          ["__items", "__item", "phrase"].map((symbol) =>
            testCase(
              `${metadata} dependency on ${symbol}`,
              before.replace(
                "grammar({ rules:",
                `grammar({ ${metadata}: ($) => [$.${symbol}], rules:`,
              ),
            ),
          ),
      ),
      testCase(
        "word dependency",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $.phrase, rules:"),
      ),
      ...["phrase:", "__items:", body, "optional($.__items)", "__item:", options, "$._kw_flag"].map(
        (part) =>
          testCase(
            `suppression at ${part}`,
            before.replace(
              part,
              `\n// oxlint-disable-next-line rule-to-test/left-recursive-option-list\n${part}`,
            ),
          ),
      ),
      testCase(
        "file suppression",
        `// oxlint-disable rule-to-test/left-recursive-option-list\n${before}`,
      ),
      testCase(
        "measured FORMAT list after rewrite",
        fixture
          .replace("=> $.__format_options", "=> prec.right($.__format_options)")
          .replace(
            "seq($.__format_option, optional($.__format_options))",
            "seq(optional($.__format_options), $.__format_option)",
          ),
      ),
    ],
    invalid: [
      { ...testCase("private right-recursive option list"), errors: [{ message }] },
      { ...testCase("measured FORMAT list", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed rules",
          before
            .replaceAll("__items", "__settings")
            .replaceAll("__item", "__setting")
            .replaceAll("phrase", "configuration")
            .replaceAll("_kw_flag", "_kw_enabled"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "already greedy public wrapper",
          before.replace("phrase: ($) => $.__items", "phrase: ($) => prec.right($.__items)"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "multiple option alternatives",
          before.replace(options, "choice($._kw_first, $.__valued, $._kw_second, $.other)"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            "__items:",
            "// oxlint-disable-next-line tree-sitter-optimize/recursive-body-reuse\n__items:",
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "phrases", "demo.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__items] });",
  );
  new RuleTester().run("left-recursive-option-list", leftRecursiveOptionList, {
    valid: [moduleCase("root inline metadata")],
    invalid: [],
  });
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.phrase, $.other]];",
  );
  new RuleTester().run("left-recursive-option-list", leftRecursiveOptionList, {
    valid: [moduleCase("wrapper precedence in another module")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $.phrase is documentation.\nexport default ($) => [["phrase", $.other]];',
  );
  new RuleTester().run("left-recursive-option-list", leftRecursiveOptionList, {
    valid: [],
    invalid: [
      { ...moduleCase("comments and strings are not dependencies"), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
