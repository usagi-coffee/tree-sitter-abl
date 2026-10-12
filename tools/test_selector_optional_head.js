import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { selectorOptionalHeadExtraction } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-selector-optional-head-"));
const selector =
  'choice(kw("BUTTON"), $._kw_window, seq($._kw_value, "(", field("kind", $._expression), ")"))';
const target = 'seq(field("handle", $.identifier), optional($._pool))';
const tail = "optional($.flag), optional(seq($.assignment, optional($.trigger)))";
const sequence = `seq(${selector}, optional($._target), ${tail})`;
const before = `export default grammar({ rules: {
  __demo_body: ($) => ${sequence},
  _target: ($) => ${target},
} });`;
const fixture = readFileSync(new URL("./fixtures/create-widget-head.js", import.meta.url), "utf8");
const testCase = (name, code) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /mixed keyword selector.*expanded optional clause into one hidden head.*non-recursive field-led sequence.*complete precedence, fields, aliases and optionality.*distinct keyword tokens.*ACTION_COUNT, Wasm memory and parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("selector-optional-head-extraction", selectorOptionalHeadExtraction, {
    valid: [
      testCase(
        "extracted head expands the optional clause without adding a nested boundary",
        `export default grammar({ rules: {
          __demo_body: ($) => seq($.__demo_head, ${tail}),
          __demo_head: ($) => seq(${selector}, optional(${target})),
          _target: ($) => ${target},
        } });`,
      ),
      testCase(
        "pure keyword selector",
        before.replace(selector, 'choice(kw("BUTTON"), $._kw_window)'),
      ),
      testCase("only one keyword branch", before.replace('kw("BUTTON"), ', "")),
      testCase("arbitrary selector symbol", before.replace("$._kw_window", "$.name")),
      testCase("duplicate selector branches", before.replace("$._kw_window", 'kw("BUTTON")')),
      testCase("required clause", before.replace("optional($._target)", "$._target")),
      testCase("visible clause", before.replaceAll("$._target", "$.target")),
      testCase("keyword clause", before.replaceAll("$._target", "$._kw_target")),
      testCase(
        "already expanded clause",
        before.replace("optional($._target)", `optional(${target})`),
      ),
      testCase("required suffix", before.replace("optional($.flag)", "$.flag")),
      testCase("only one tail", before.replace(", optional($.flag)", "")),
      testCase(
        "no compound tail",
        before.replace("seq($.assignment, optional($.trigger))", "$.assignment"),
      ),
      testCase("recursive owner", before.replace("optional($.trigger)", "optional($.__demo_body)")),
      testCase("recursive clause", before.replace("optional($._pool)", "optional($._target)")),
      testCase("lexical clause", before.replace(target, 'token("target")')),
      testCase(
        "lexical field in clause",
        before.replace('field("handle", $.identifier)', 'field("handle", token(/[a-z]+/))'),
      ),
      testCase(
        "dynamic field precedence in selector",
        before.replace("$._expression)", "prec.dynamic(1, $._expression))"),
      ),
      testCase(
        "nullable clause",
        before.replace(target, 'seq(optional(field("handle", $.identifier)))'),
      ),
      testCase("non-field clause", before.replace(target, 'seq("target", $.identifier)')),
      testCase("dynamic keyword", before.replace('kw("BUTTON")', "kw(buttonName)")),
      testCase("dynamic choice", before.replace("$._kw_window", "...keywords")),
      ...["alias", "token", "prec.dynamic"].map((wrapper) =>
        testCase(
          `unsupported ${wrapper} scope`,
          before.replace(
            sequence,
            wrapper === "alias"
              ? `alias(${sequence}, $.body)`
              : wrapper === "prec.dynamic"
                ? `prec.dynamic(1, ${sequence})`
                : `token(${sequence})`,
          ),
        ),
      ),
      ...["inline", "conflicts", "externals", "supertypes", "precedences"].map((metadata) =>
        testCase(
          `${metadata} restriction`,
          before.replace("grammar({ rules:", `grammar({ ${metadata}: ($) => [$._target], rules:`),
        ),
      ),
      testCase(
        "owner metadata restriction",
        before.replace("grammar({ rules:", "grammar({ inline: ($) => [$.__demo_body], rules:"),
      ),
      ...["__demo_body:", selector, "optional($._target)", "_target:"].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/selector-optional-head-extraction\n${part}`,
          ),
        ),
      ),
    ],
    invalid: [
      { ...testCase("local optional field-led clause", before), errors: [{ message }] },
      { ...testCase("measured CREATE widget shape", fixture), errors: [{ message }] },
      {
        ...testCase(
          "external clause requires definition review",
          before.replace(`  _target: ($) => ${target},\n`, ""),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "retain complete named precedence",
          before.replace(target, `prec.right("target", ${target})`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "preserve keyword abbreviation options",
          before.replace('kw("BUTTON")', 'kw("BUTTON", { offset: 4 })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression does not disable the suggestion",
          before.replace(
            "__demo_body:",
            "// oxlint-disable-next-line tree-sitter-optimize/recurse\n__demo_body:",
          ),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
