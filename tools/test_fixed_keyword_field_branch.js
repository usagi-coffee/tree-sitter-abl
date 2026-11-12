import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseKeywordSequence } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-fixed-keyword-field-"));
const body =
  'seq($._kw_source, field("source", $.identifier), $._kw_for, kw("TARGET"), field("target", $.identifier))';
const caller = "seq(choice($.__branch, $.other), $._terminator)";
const before = `export default grammar({ rules: {
  root: ($) => ${caller},
  __branch: ($) => ${body},
} });`;
const fixture = readFileSync(
  new URL("./fixtures/fixed-keyword-field-branch.js", import.meta.url),
  "utf8",
);
const branchDefinition = fixture.slice(
  fixture.indexOf("  __create_alias:"),
  fixture.lastIndexOf("});"),
);
const branchBody = branchDefinition
  .slice(branchDefinition.indexOf("seq("))
  .trim()
  .replace(/,$/, "");
const after = fixture.replace("$.__create_alias,", `${branchBody},`).replace(branchDefinition, "");
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /one unaliased choice-arm use.*five-part required keyword\/field branch.*keyword options, token identities, field scope and branch order.*external references and grammar metadata.*actions, table bytes, memory, parsing speed and complete valid and recovery trees/;

try {
  new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
    valid: [
      testCase("measured branch after inlining", after),
      ...["branch", "_branch", "__branch_body"].map((name) =>
        testCase(`unsupported rule name ${name}`, before.replaceAll("__branch", name)),
      ),
      testCase("unused helper", before.replace("$.__branch,", "$.unused,")),
      testCase("multiple uses", before.replace("$.__branch,", "$.__branch, $.__branch,")),
      testCase("direct sequence use", before.replace(caller, "seq($.__branch, $._terminator)")),
      testCase(
        "single choice branch",
        before.replace("choice($.__branch, $.other)", "choice($.__branch)"),
      ),
      testCase("computed reference", before.replace("$.__branch,", '$["__branch"],')),
      testCase("dynamic reference", `${before}\nconst value = ($) => $[name];`),
      testCase("non-rule reference", `${before}\nconst value = ($) => $.__branch;`),
      testCase("computed definition", before.replace("__branch:", '["__branch"]:')),
      testCase("spread rule definitions", before.replace("rules: {", "rules: { ...otherRules,")),
      testCase("spread choice alternatives", before.replace("$.other)", "...alternatives)")),
      ...[
        "alias(BODY, $.clause)",
        'field("clause", BODY)',
        "token(BODY)",
        "token.immediate(BODY)",
        "prec.dynamic(1, BODY)",
        "custom(BODY)",
      ].map((wrapper) =>
        testCase(
          `unsafe caller ${wrapper}`,
          before.replace(caller, wrapper.replace("BODY", caller)),
        ),
      ),
      ...[
        ["$._kw_source", "$.source"],
        ["$._kw_source", "optional($._kw_source)"],
        ["$._kw_for", "optional($._kw_for)"],
        ['kw("TARGET")', "kw(word)"],
        ['kw("TARGET")', 'kw("TARGET", options)'],
        ['kw("TARGET")', 'alias(kw("TARGET"), $.target)'],
        ['field("source", $.identifier)', 'optional(field("source", $.identifier))'],
        ['field("source", $.identifier)', "field(name, $.identifier)"],
        ['field("source", $.identifier)', 'field("", $.identifier)'],
        [
          'field("source", $.identifier)',
          'field("source", choice($.identifier, $.string_literal))',
        ],
        ['field("source", $.identifier)', 'field("source", alias($.identifier, $.name))'],
        ['field("target", $.identifier)', 'field("source", $.identifier)'],
        ['field("target", $.identifier)', 'field("target", $.identifier), $.extra'],
        ['field("target", $.identifier)', 'repeat(field("target", $.identifier))'],
        ["$._kw_for, ", ""],
      ].map(([from, to]) => testCase(`unsupported part ${to}`, before.replace(from, to))),
      testCase("static precedence on helper", before.replace(body, `prec.right(${body})`)),
      testCase(
        "recursion through caller",
        before.replace('field("source", $.identifier)', 'field("source", $.root)'),
      ),
      testCase(
        "dynamic value dependency",
        before
          .replace('field("source", $.identifier)', 'field("source", $.value)')
          .replace("root:", "value: ($) => makeValue($), root:"),
      ),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].flatMap(
        (metadata) =>
          ["__branch", "root"].map((name) =>
            testCase(
              `${metadata} dependency ${name}`,
              before.replace(
                "grammar({ rules:",
                `grammar({ ${metadata}: ($) => [$.${name}], rules:`,
              ),
            ),
          ),
      ),
      testCase(
        "word dependency",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $.__branch, rules:"),
      ),
      ...[
        "root:",
        "__branch:",
        body,
        "choice($.__branch",
        "$.__branch,",
        'kw("TARGET")',
        'field("target", $.identifier)',
      ].map((part) =>
        testCase(
          `suppressed at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/single-use-keyword-sequence\n${part}`,
          ),
        ),
      ),
      testCase(
        "file suppression",
        `// oxlint-disable rule-to-test/single-use-keyword-sequence\n${before}`,
      ),
    ],
    invalid: [
      { ...testCase("fixed required keyword and field branch"), errors: [{ message }] },
      { ...testCase("measured CREATE ALIAS branch", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed branch and fields",
          before
            .replaceAll("__branch", "__operation")
            .replaceAll('"source"', '"input"')
            .replaceAll('"target"', '"output"'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static keyword options",
          before.replace('kw("TARGET")', 'kw("DESTINATION", { offset: 4, alias: "TARGET" })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static caller precedence",
          before.replace(caller, `prec.right("branch", ${caller})`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("optional caller", before.replace(caller, `optional(${caller})`)),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            'kw("TARGET")',
            '// oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner\nkw("TARGET")',
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "statements", "operation.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__branch] });",
  );
  new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
    valid: [moduleCase("external inline metadata")],
    invalid: [],
  });
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "operation.js"),
    "export default ($) => [[$.__branch, $.other]];",
  );
  new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
    valid: [moduleCase("precedence dependency in another file")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "operation.js"),
    '// $.__branch is a comment.\nexport default ($) => [["__branch", $.other]];',
  );
  new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
    valid: [],
    invalid: [
      { ...moduleCase("comments and strings are not dependencies"), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
