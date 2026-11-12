import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseFieldChoiceSequence } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-structured-field-choice-"));
const fixture = readFileSync(
  new URL("./fixtures/structured-field-choice-branch.js", import.meta.url),
  "utf8",
);
const branchName = "__dde_advise_or_send_branch";
const branchDefinition = fixture.slice(
  fixture.indexOf(`  ${branchName}:`),
  fixture.indexOf("  __dde_mode:"),
);
const branchBody = branchDefinition.slice(branchDefinition.indexOf("seq("), -3);
const after = fixture.replace(`$.${branchName},`, `${branchBody},`).replace(branchDefinition, "");
const testCase = (name, code = fixture, cwd = directory) => ({
  name,
  code,
  cwd,
  filename: join(cwd, "grammar/statements/dde.js"),
});
const message =
  /one unaliased choice-arm use.*structured field-choice branch.*retaining its shared suffix helper.*alternative order, field scope, aliases, keyword options and precedence.*external references and metadata.*actions, table bytes, memory, parsing speed and complete valid and recovery trees/;
const tail = 'seq(kw("ITEM"), field("item", $._expression), optional($.__dde_time_phrase))';

try {
  new RuleTester().run("single-use-field-choice-sequence", singleUseFieldChoiceSequence, {
    valid: [
      testCase("measured expanded branch", after),
      ...["branch", "_branch", "__branch_body"].map((name) =>
        testCase(`unsupported visibility: ${name}`, fixture.replaceAll(branchName, name)),
      ),
      testCase(
        "multiple uses",
        fixture.replace(`$.${branchName},`, `$.${branchName}, $.${branchName},`),
      ),
      testCase("unused branch", fixture.replace(`$.${branchName},`, "$.other,")),
      testCase(
        "sequence caller",
        fixture.replace(`$.${branchName},`, `seq("PREFIX", $.${branchName}),`),
      ),
      testCase("single choice arm", fixture.replace("      choice(\n", "      seq(\n")),
      testCase("computed use", fixture.replace(`$.${branchName},`, `$["${branchName}"],`)),
      testCase("dynamic reference", `${fixture}\nconst value = ($) => $[name];`),
      testCase(
        "spread choice arm",
        fixture.replace(`$.${branchName},`, `$.${branchName}, ...other,`),
      ),
      testCase("computed definition", fixture.replace(`${branchName}:`, `["${branchName}"]:`)),
      testCase(
        "spread definition",
        fixture.replace("  dde_statement:", "  ...other,\n  dde_statement:"),
      ),
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
        ['alias(kw("ADVISE"), $.identifier)', 'kw("ADVISE")'],
        ['alias(kw("ADVISE"), $.identifier)', 'alias(kw("ADVISE"), $._hidden)'],
        ['kw("ADVISE")', 'kw("ADVISE", options)'],
        ['field("action", choice(alias(kw("ADVISE")', 'field("", choice(alias(kw("ADVISE")'],
        ['field("ddeid", $._expression)', 'optional(field("ddeid", $._expression))'],
        ['field("ddeid", $._expression)', 'field("ddeid", choice($.first, $.second))'],
        ['field("ddeid",', 'field("action",'],
        ['field("mode", alias($.__dde_mode, $.identifier))', 'field("mode", $.identifier)'],
        ["alias($.__dde_mode, $.identifier)", "alias($.mode, $.identifier)"],
        [
          'seq($._kw_source, field("source", $._expression))',
          'seq($.source, field("source", $._expression))',
        ],
        [
          'seq($._kw_source, field("source", $._expression))',
          'seq($._kw_source, optional(field("source", $._expression)))',
        ],
        [
          'seq($._kw_source, field("source", $._expression)),',
          'seq($._kw_source, field("source", $._expression)), $.extra,',
        ],
        ["      $.__dde_item_time_body,", "      optional($.__dde_item_time_body),"],
        [tail, 'seq(kw("ITEM"), field("item", $._expression))'],
        [
          tail,
          'seq(kw("ITEM"), optional(field("item", $._expression)), optional($.__dde_time_phrase))',
        ],
        [tail, `seq(kw("ITEM"), field("item", $._expression), optional($.${branchName}))`],
      ].map(([from, to]) =>
        testCase(
          `unsupported shape: ${to}`,
          branchDefinition.includes(from)
            ? fixture.replace(branchDefinition, branchDefinition.replace(from, to))
            : fixture.replace(from, to),
        ),
      ),
      testCase(
        "unshared suffix helper",
        fixture.replace(
          "      $.__dde_item_time_body,\n    ),\n  __dde_item_time_body:",
          "      $.other,\n    ),\n  __dde_item_time_body:",
        ),
      ),
      testCase("shared suffix name", fixture.replaceAll("__dde_item_time_body", "_item_time_body")),
      testCase(
        "missing suffix definition",
        fixture.replace(`  __dde_item_time_body: ($) =>\n    ${tail},\n`, ""),
      ),
      testCase(
        "indirect recursive choice",
        fixture.replace('choice(kw("START"), $._kw_stop)', 'choice(kw("START"), $.__dde_prefix)'),
      ),
      testCase(
        "body suppression",
        fixture.replace(
          branchDefinition,
          branchDefinition.replace(
            "    seq(",
            "    // oxlint-disable-next-line rule-to-test/single-use-field-choice-sequence\n    seq(",
          ),
        ),
      ),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras", "word"].map(
        (metadata) =>
          testCase(
            `${metadata} metadata`,
            fixture
              .replace(
                "export default ({ kw }) => ({",
                `export default grammar({ ${metadata}: ($) => [$.${branchName}], rules: {`,
              )
              .replace(/\}\);\s*$/, "}});"),
          ),
      ),
      ...[
        `${branchName}:`,
        "__dde_prefix:",
        `$.${branchName},`,
        'field("action", choice(alias(kw("ADVISE")',
        'field("mode",',
        "__dde_item_time_body:",
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
      { ...testCase("measured DDE structured branch"), errors: [{ message }] },
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
          fixture.replace('kw("ADVISE")', 'kw("ADVISE", { offset: 3, alias: "ADV" })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("keyword helper action", fixture.replace('kw("ADVISE")', "$._kw_advise")),
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
