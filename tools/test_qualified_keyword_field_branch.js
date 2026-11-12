import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseKeywordSequence } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-qualified-keyword-field-"));
const modifier = 'optional(field("kind", kw("TEMP-TABLE")))';
const flag = 'optional(alias(kw("PRESELECT"), $.preselect))';
const body = `seq($._kw_parameter, $._kw_buffer, field("name", $.identifier), $._kw_for, ${modifier}, field("table", $._qualified_identifier), ${flag})`;
const caller = "seq($._kw_define, choice($.other, $.__branch))";
const before = `export default grammar({ rules: {
  root: ($) => ${caller},
  __branch: ($) => ${body},
} });`;
const fixture = readFileSync(
  new URL("./fixtures/qualified-keyword-field-branch.js", import.meta.url),
  "utf8",
);
const start = fixture.indexOf("  __parameter_buffer_parameter:");
const definition = fixture.slice(start, fixture.indexOf("\n\n", start) + 2);
const fixtureBody = definition.slice(definition.indexOf("seq(")).trim().replace(/,$/, "");
const after = fixture
  .replace("$.__parameter_buffer_parameter,", `${fixtureBody},`)
  .replace(definition, "");
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /one unaliased choice-arm use.*qualified-field branch.*optional keyword modifier and trailing flag.*keyword options, token identities, field scope, aliases and branch order.*external references and grammar metadata.*actions, table bytes, memory, parsing speed and complete valid and recovery trees/;

try {
  new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
    valid: [
      testCase("measured branch after inlining", after),
      ...["branch", "_branch", "__branch_body"].map((name) =>
        testCase(`unsupported visibility ${name}`, before.replaceAll("__branch", name)),
      ),
      testCase("unused helper", before.replace("$.other, $.__branch", "$.other, $.unused")),
      testCase("multiple uses", before.replace("$.other,", "$.__branch,")),
      testCase("direct use", before.replace(caller, "seq($.__branch, $._terminator)")),
      testCase("single choice arm", before.replace("$.other, ", "")),
      testCase("computed use", before.replace("$.__branch)", '$["__branch"])')),
      testCase("dynamic reference", `${before}\nconst value = ($) => $[name];`),
      testCase("non-rule reference", `${before}\nconst value = ($) => $.__branch;`),
      testCase("computed definition", before.replace("__branch:", '["__branch"]:')),
      testCase("spread rules", before.replace("rules: {", "rules: { ...otherRules,")),
      testCase("spread alternatives", before.replace("$.other,", "...alternatives,")),
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
        ["$._kw_parameter", "optional($._kw_parameter)"],
        ["$._kw_buffer", "$.buffer"],
        ["$._kw_for", "repeat($._kw_for)"],
        ['field("name", $.identifier)', 'optional(field("name", $.identifier))'],
        ['field("name", $.identifier)', 'field("", $.identifier)'],
        ['field("name", $.identifier)', "field(name, $.identifier)"],
        ['field("name", $.identifier)', 'field("name", alias($.identifier, $.name))'],
        [modifier, 'field("kind", kw("TEMP-TABLE"))'],
        [modifier, 'optional(field("kind", $.identifier))'],
        [modifier, 'optional(field("kind", choice(kw("FIRST"), kw("SECOND"))))'],
        [modifier, 'optional(field("kind", kw(value)))'],
        [modifier, 'optional(field("kind", kw("TEMP-TABLE", options)))'],
        [modifier, 'optional(field("kind", kw("TEMP-TABLE")), $.extra)'],
        ['field("table", $._qualified_identifier)', 'field("name", $._qualified_identifier)'],
        ['field("table", $._qualified_identifier)', 'field("kind", $._qualified_identifier)'],
        ['field("table", $._qualified_identifier)', 'field("table", choice($.a, $.b))'],
        [flag, 'alias(kw("PRESELECT"), $.preselect)'],
        [flag, 'optional(kw("PRESELECT"))'],
        [flag, 'optional(alias(kw("PRESELECT"), $.__preselect))'],
        [flag, "optional(alias($.preselect_value, $.preselect))"],
        [flag, 'optional(alias(kw("PRESELECT"), $.preselect, $.extra))'],
        [flag, `${flag}, $.extra`],
      ].map(([from, to]) => testCase(`unsupported part ${to}`, before.replace(from, to))),
      testCase(
        "arbitrary seven-part sequence",
        before.replace(body, 'seq(kw("START"), $.a, $.b, $.c, $.d, $.e, $.f)'),
      ),
      testCase("helper precedence", before.replace(body, `prec.right(${body})`)),
      testCase(
        "direct recursion",
        before.replace('field("name", $.identifier)', 'field("name", $.__branch)'),
      ),
      testCase(
        "caller recursion",
        before.replace('field("name", $.identifier)', 'field("name", $.root)'),
      ),
      testCase(
        "dynamic dependency",
        before
          .replace("$.identifier", "$.value")
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
        "choice($.other",
        "$.__branch)",
        modifier,
        flag,
        'kw("PRESELECT")',
      ].map((part) =>
        testCase(
          `suppression at ${part}`,
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
      { ...testCase("qualified-field branch"), errors: [{ message }] },
      { ...testCase("measured PARAMETER BUFFER branch", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed branch and fields",
          before
            .replaceAll("__branch", "__operation")
            .replaceAll('"name"', '"source"')
            .replaceAll('"table"', '"target"'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static keyword options",
          before.replace(
            'kw("TEMP-TABLE")',
            'kw("TEMP-TABLE", { offset: 4, alias: "TEMP-TABLE" })',
          ),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "all keyword references",
          before
            .replace('kw("TEMP-TABLE")', "$._kw_temporary")
            .replace('kw("PRESELECT")', "$._kw_selected"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "caller static precedence",
          before.replace(caller, `prec.right("branch", ${caller})`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "another rule suppression",
          before.replace(
            flag,
            `// oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner\n${flag}`,
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
    valid: [moduleCase("external precedence metadata")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "operation.js"),
    '// $.__branch is documentation.\nexport default ($) => [["__branch", $.other]];',
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
