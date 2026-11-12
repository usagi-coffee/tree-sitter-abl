import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseFieldChoiceSequence } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-optional-field-choice-"));
const fixture = readFileSync(
  new URL("./fixtures/optional-field-choice-branch.js", import.meta.url),
  "utf8",
);
const branchName = "__dde_execute_or_terminate_branch";
const branchDefinition = fixture.slice(
  fixture.indexOf(`  ${branchName}:`),
  fixture.indexOf("  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset"),
);
const branchBody = branchDefinition
  .slice(branchDefinition.indexOf("seq("))
  .trim()
  .replace(/,$/, "");
const after = fixture.replace(`$.${branchName},`, `${branchBody},`).replace(branchDefinition, "");
const testCase = (name, code = fixture, cwd = directory) => ({
  name,
  code,
  cwd,
  filename: join(cwd, "grammar/statements/dde.js"),
});
const message =
  /one unaliased choice-arm use.*structured field-choice branch with its optional valued clause.*retaining its shared suffix helper.*alternative order, field scope, aliases, keyword options and precedence.*external references and metadata.*actions, table bytes, memory, parsing speed and complete valid and recovery trees/;
const clause = 'seq($._kw_command, field("command", $._expression), optional($.__dde_time_phrase))';
const tail = 'seq(kw("TIME"), field("time", $._expression))';

try {
  new RuleTester().run("single-use-field-choice-sequence", singleUseFieldChoiceSequence, {
    valid: [
      testCase("measured branch after inlining", after),
      ...["branch", "_branch", "__branch_body"].map((name) =>
        testCase(`unsupported visibility: ${name}`, fixture.replaceAll(branchName, name)),
      ),
      testCase("unused branch", fixture.replace(`$.${branchName},`, "$.other,")),
      testCase(
        "multiple uses",
        fixture.replace(`$.${branchName},`, `$.${branchName}, $.${branchName},`),
      ),
      testCase(
        "sequence caller",
        fixture.replace(`$.${branchName},`, `seq("PREFIX", $.${branchName}),`),
      ),
      testCase("computed use", fixture.replace(`$.${branchName},`, `$["${branchName}"],`)),
      testCase("computed definition", fixture.replace(`${branchName}:`, `["${branchName}"]:`)),
      testCase("dynamic reference", `${fixture}\nconst value = ($) => $[name];`),
      testCase("non-rule reference", `${fixture}\nconst value = ($) => $.${branchName};`),
      testCase(
        "spread definition",
        fixture.replace("  dde_statement:", "  ...other,\n  dde_statement:"),
      ),
      testCase("spread choice", fixture.replace(`$.${branchName},`, `$.${branchName}, ...other,`)),
      ...[
        "alias(BODY, $.branch)",
        'field("branch", BODY)',
        "token(BODY)",
        "token.immediate(BODY)",
        "prec.dynamic(1, BODY)",
        "custom(BODY)",
      ].map((wrapper) =>
        testCase(
          `unsupported caller wrapper: ${wrapper}`,
          fixture.replace(`$.${branchName},`, `${wrapper.replace("BODY", `$.${branchName}`)},`),
        ),
      ),
      ...[
        ['alias(kw("EXECUTE"), $.identifier)', 'kw("EXECUTE")'],
        ['alias(kw("EXECUTE"), $.identifier)', 'alias(kw("EXECUTE"), $._hidden)'],
        ['kw("EXECUTE")', 'kw("EXECUTE", options)'],
        ['field("ddeid", $._expression)', 'field("ddeid", choice($.first, $.second))'],
        ['field("command",', 'field("ddeid",'],
        ["$._kw_command", "$.command"],
        ["$._kw_command", "optional($._kw_command)"],
        ['field("command", $._expression)', 'optional(field("command", $._expression))'],
        ['field("command", $._expression)', 'field("", $._expression)'],
        ['field("command", $._expression)', 'field("command", alias($.value, $.name))'],
        [`optional(${clause})`, clause],
        [clause, 'seq($._kw_command, field("command", $._expression))'],
        [clause, 'seq($._kw_command, field("command", $._expression), $.__dde_time_phrase)'],
        [clause, `seq($._kw_command, field("command", $._expression), optional($.${branchName}))`],
        [tail, 'seq(kw("TIME"), optional(field("time", $._expression)))'],
        [tail, 'seq(kw("TIME"), field("time", $._expression), $.extra)'],
        [tail, `seq(kw("TIME"), field("time", $.${branchName}))`],
        [tail, 'seq(kw("TIME"), field("time", $.__dde_prefix))'],
      ].map(([from, to]) =>
        testCase(
          `unsupported shape: ${to}`,
          branchDefinition.includes(from)
            ? fixture.replace(branchDefinition, branchDefinition.replace(from, to))
            : fixture.replace(from, to),
        ),
      ),
      testCase(
        "unshared suffix",
        fixture.replace(
          'seq(kw("ITEM"), field("item", $._expression), optional($.__dde_time_phrase))',
          'seq(kw("ITEM"), field("item", $._expression))',
        ),
      ),
      testCase("shared suffix name", fixture.replaceAll("__dde_time_phrase", "_time_phrase")),
      testCase(
        "missing suffix definition",
        fixture.replace(`  __dde_time_phrase: ($) => ${tail},\n`, ""),
      ),
      ...[
        "inline",
        "conflicts",
        "precedences",
        "supertypes",
        "externals",
        "extras",
        "word",
      ].flatMap((metadata) =>
        [branchName, "__dde_prefix"].map((name) =>
          testCase(
            `${metadata} metadata: ${name}`,
            fixture
              .replace(
                "export default ({ kw }) => ({",
                `export default grammar({ ${metadata}: ($) => [$.${name}], rules: {`,
              )
              .replace(/\}\);\s*$/, "}});"),
          ),
        ),
      ),
      ...[
        `${branchName}:`,
        "__dde_prefix:",
        `$.${branchName},`,
        branchBody,
        clause,
        'field("command",',
        "__dde_time_phrase:",
        tail,
      ].map((part) =>
        testCase(
          `existing rule suppression at ${part}`,
          fixture.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/single-use-field-choice-sequence\n${part}`,
          ),
        ),
      ),
      testCase(
        "file suppression",
        `// oxlint-disable rule-to-test/single-use-field-choice-sequence\n${fixture}`,
      ),
    ],
    invalid: [
      { ...testCase("measured DDE optional clause branch"), errors: [{ message }] },
      {
        ...testCase(
          "renamed branch and fields",
          fixture.replaceAll("__dde", "__channel").replaceAll('"ddeid"', '"channel"'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "keyword options",
          fixture.replace('kw("EXECUTE")', 'kw("EXECUTE", { offset: 4, alias: "EXEC" })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("keyword helper action", fixture.replace('kw("EXECUTE")', "$._kw_execute")),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          fixture.replace(
            `${branchName}:`,
            `\n// oxlint-disable-next-line unrelated/rule\n${branchName}:`,
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const project = join(directory, "project");
  mkdirSync(join(project, "grammar", "precedences"), { recursive: true });
  writeFileSync(join(project, "grammar.js"), "export default grammar({});\n");
  writeFileSync(
    join(project, "grammar", "precedences", "branch.js"),
    `export default ($) => [[$.${branchName}, $.other]];\n`,
  );
  new RuleTester().run("single-use-field-choice-sequence", singleUseFieldChoiceSequence, {
    valid: [testCase("external precedence reference", fixture, project)],
    invalid: [],
  });
  writeFileSync(
    join(project, "grammar", "precedences", "branch.js"),
    `// $.${branchName}\nexport default ($) => [];\n`,
  );
  writeFileSync(
    join(project, "grammar.js"),
    `export default grammar({ inline: ($) => [$.${branchName}] });\n`,
  );
  new RuleTester().run("single-use-field-choice-sequence", singleUseFieldChoiceSequence, {
    valid: [testCase("external inline reference", fixture, project)],
    invalid: [],
  });
  writeFileSync(join(project, "grammar.js"), `// $.${branchName}\nexport default grammar({});\n`);
  new RuleTester().run("single-use-field-choice-sequence", singleUseFieldChoiceSequence, {
    valid: [],
    invalid: [
      { ...testCase("metadata comments are inert", fixture, project), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
