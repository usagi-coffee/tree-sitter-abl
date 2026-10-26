import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { rightRecursiveClauseReuse } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-recursive-clause-"));
const entry = "seq($._kw_next, prec.right(seq($.item, optional($.__rest))))";
const recursive = "prec.right(seq($._kw_next, $.item, optional($.__rest)))";
const before = `export default grammar({ rules: {
  first: ($) => prec.right($.__entry),
  second: ($) => prec.right(seq($._kw_group, $.__entry)),
  __entry: ($) => ${entry},
  __rest: ($) => ${recursive},
} });`;
const fixture = readFileSync(new URL("./fixtures/for-by-clause-reuse.js", import.meta.url), "utf8");
const testCase = (name, code) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /duplicates the complete sequence of right-recursive.*matching unnamed right associativity.*callers.*removing the entry helper.*optional recursion, fields, aliases and caller associativity.*metadata.*actions, table bytes, memory, parsing speed and complete valid and recovery trees/;

try {
  new RuleTester().run("right-recursive-clause-reuse", rightRecursiveClauseReuse, {
    valid: [
      testCase(
        "already reuses the recursive clause",
        before.replace(`  __entry: ($) => ${entry},\n`, "").replaceAll("$.__entry", "$.__rest"),
      ),
      testCase("public entry rule", before.replaceAll("__entry", "entry")),
      testCase("shared entry rule", before.replaceAll("__entry", "_entry")),
      testCase("public recursive rule", before.replaceAll("__rest", "rest")),
      testCase("shared recursive rule", before.replaceAll("__rest", "_rest")),
      testCase("single caller", before.replace("prec.right($.__entry)", "$.item")),
      testCase("unused entry", before.replaceAll("$.__entry", "$.item")),
      testCase("missing recursive rule", before.replace(`  __rest: ($) => ${recursive},\n`, "")),
      testCase(
        "different prefix",
        before.replace(recursive, recursive.replace("_kw_next", "_kw_other")),
      ),
      testCase("different item", before.replace(recursive, recursive.replace("$.item", "$.other"))),
      testCase(
        "different continuation",
        before.replace(recursive, recursive.replace("$.__rest", "$.__other")),
      ),
      testCase(
        "required recursion",
        before.replace(recursive, recursive.replace("optional($.__rest)", "$.__rest")),
      ),
      testCase(
        "repeated recursion",
        before.replace(recursive, recursive.replace("optional($.__rest)", "repeat($.__rest)")),
      ),
      testCase(
        "extra entry prefix",
        before.replace(
          entry,
          `seq("EXTRA", $._kw_next, prec.right(seq($.item, optional($.__rest))))`,
        ),
      ),
      testCase(
        "extra recursive suffix",
        before.replace(recursive, 'prec.right(seq($._kw_next, $.item, optional($.__rest), "."))'),
      ),
      testCase("entry precedence on whole rule", before.replace(entry, `prec.right(${entry})`)),
      testCase(
        "entry suffix without precedence",
        before.replace(entry, "seq($._kw_next, seq($.item, optional($.__rest)))"),
      ),
      testCase(
        "entry suffix left associativity",
        before.replace(entry, entry.replace("prec.right", "prec.left")),
      ),
      testCase(
        "entry suffix named precedence",
        before.replace(entry, entry.replace("prec.right(", 'prec.right("binding", ')),
      ),
      testCase(
        "recursive left associativity",
        before.replace(recursive, recursive.replace("prec.right", "prec.left")),
      ),
      testCase(
        "recursive named precedence",
        before.replace(recursive, recursive.replace("prec.right(", 'prec.right("binding", ')),
      ),
      testCase(
        "recursive body without precedence",
        before.replace(recursive, "seq($._kw_next, $.item, optional($.__rest))"),
      ),
      testCase("field-wrapped item", before.replaceAll("$.item", 'field("item", $.item)')),
      testCase(
        "field-wrapped prefix",
        before.replaceAll("$._kw_next", 'field("prefix", $._kw_next)'),
      ),
      testCase("recursive prefix", before.replaceAll("$._kw_next", "$.__rest")),
      testCase("recursive item", before.replaceAll("$.item", "$.__rest")),
      testCase(
        "entry self recursion",
        before.replaceAll("optional($.__rest)", "optional($.__entry)"),
      ),
      testCase("caller without precedence", before.replace("prec.right($.__entry)", "$.__entry")),
      testCase(
        "caller with named precedence",
        before.replace("prec.right($.__entry)", 'prec.right("binding", $.__entry)'),
      ),
      testCase(
        "caller with left associativity",
        before.replace("prec.right($.__entry)", "prec.left($.__entry)"),
      ),
      testCase(
        "caller with a following member",
        before.replace("seq($._kw_group, $.__entry)", "seq($.__entry, $._kw_group)"),
      ),
      ...[
        "alias",
        "field",
        "token",
        "token.immediate",
        "prec.dynamic",
        "optional",
        "repeat",
        "choice",
      ].map((wrapper) =>
        testCase(
          `${wrapper} around a use`,
          before.replace(
            "prec.right($.__entry)",
            `prec.right(${wrapper === "alias" ? "alias($.__entry, $.clause)" : wrapper === "field" ? 'field("clause", $.__entry)' : wrapper === "prec.dynamic" ? "prec.dynamic(1, $.__entry)" : wrapper === "choice" ? "choice($.__entry, $.other)" : `${wrapper}($.__entry)`})`,
          ),
        ),
      ),
      testCase(
        "computed reference",
        before.replace("prec.right($.__entry)", 'prec.right($["__entry"])'),
      ),
      testCase("dynamic reference", `${before}\nfunction lookup($, name) { return $[name]; }`),
      testCase("non-rule reference", `${before}\nfunction lookup($) { return $.__entry; }`),
      testCase(
        "reference from another rule map",
        `${before}\nconst other = grammar({ rules: { third: ($) => prec.right($.__entry) } });`,
      ),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].flatMap(
        (metadata) =>
          ["__entry", "__rest", "first"].map((symbol) =>
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
        before.replace("grammar({ rules:", "grammar({ word: ($) => $.__entry, rules:"),
      ),
      ...[
        "__entry:",
        "__rest:",
        entry,
        recursive,
        "first:",
        "prec.right($.__entry)",
        "optional($.__rest)",
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/right-recursive-clause-reuse\n${part}`,
          ),
        ),
      ),
    ],
    invalid: [
      { ...testCase("two compatible entry callers", before), errors: [{ message }] },
      { ...testCase("measured FOR BY clause", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed helpers and symbols",
          before
            .replaceAll("__entry", "__demo_start")
            .replaceAll("__rest", "__demo_continuation")
            .replaceAll("$.item", "$.__demo_element")
            .replaceAll("_kw_next", "_kw_step"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("literal prefix", before.replaceAll("$._kw_next", '"NEXT"')),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static keyword prefix",
          before.replaceAll("$._kw_next", 'kw("NEXT", { offset: 2 })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "private callers",
          before.replace("first:", "__first:").replace("second:", "__second:"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "three callers",
          before.replace("__entry:", "third: ($) => prec.right($.__entry), __entry:"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            "__entry:",
            "// oxlint-disable-next-line tree-sitter-optimize/single-use-sequence\n__entry:",
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name, before),
    filename: join(directory, "grammar", "statements", "demo.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const symbol of ["__entry", "__rest", "first"]) {
    writeFileSync(
      join(directory, "grammar.js"),
      `export default grammar({ conflicts: ($) => [[$.${symbol}]] });`,
    );
    new RuleTester().run("right-recursive-clause-reuse", rightRecursiveClauseReuse, {
      valid: [moduleCase(`project-root metadata on ${symbol}`)],
      invalid: [],
    });
  }
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.__rest, $.other]];",
  );
  new RuleTester().run("right-recursive-clause-reuse", rightRecursiveClauseReuse, {
    valid: [moduleCase("precedence dependency in another module")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $.__rest is only documentation.\nexport default ($) => [["__rest", $.other]];',
  );
  new RuleTester().run("right-recursive-clause-reuse", rightRecursiveClauseReuse, {
    valid: [],
    invalid: [
      { ...moduleCase("comments and strings are not dependencies"), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
