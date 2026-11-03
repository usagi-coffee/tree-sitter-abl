import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { optionalChoicePrefixHoist } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-optional-choice-prefix-"));
const fixture = readFileSync(
  new URL("./fixtures/function-forward-tail.js", import.meta.url),
  "utf8",
);
const prefix = "optional($.__function_extent_phrase)";
const shortBranch = `seq(${prefix}, $._routine_access_modifier)`;
const use = "optional($.__function_forward_tail)";
const testCase = (name, code = fixture) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /repeats optional.*non-empty alternatives.*prefix alone.*optional prefix immediately before.*sole optional sequence use.*non-empty suffixes.*fields, aliases, token identities, branch order and caller precedence.*cross-file uses and metadata.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;
const metadataCase = (metadata, symbol) =>
  fixture
    .replace(
      "export default ({ kw }) => ({",
      `export default grammar({ ${metadata}: ($) => [$.${symbol}], rules: {`,
    )
    .replace("\n});", "\n} });");

try {
  new RuleTester().run("optional-choice-prefix-hoist", optionalChoicePrefixHoist, {
    valid: [
      testCase(
        "measured hoisted EXTENT",
        fixture
          .replace(use, `${prefix}, ${use}`)
          .replace(`        ${prefix},\n`, "")
          .replace(shortBranch, "$._routine_access_modifier")
          .replace("      $.__function_extent_phrase,\n", ""),
      ),
      testCase("public helper", fixture.replaceAll("__function_forward_tail", "forward_tail")),
      testCase("shared helper", fixture.replaceAll("__function_forward_tail", "_forward_tail")),
      testCase("one prefixed branch", fixture.replace(`      ${shortBranch},\n`, "")),
      testCase("no standalone prefix", fixture.replace("      $.__function_extent_phrase,\n", "")),
      testCase(
        "different standalone prefix",
        fixture.replace("      $.__function_extent_phrase,\n", "      $.other,\n"),
      ),
      testCase("different branch prefix", fixture.replace(prefix, "optional($.other)")),
      testCase("required branch prefix", fixture.replace(prefix, "$.__function_extent_phrase")),
      testCase(
        "nullable remaining branch",
        fixture.replace(shortBranch, `seq(${prefix}, optional($._routine_access_modifier))`),
      ),
      testCase(
        "nullable field-wrapped remaining branch",
        fixture.replace(shortBranch, `seq(${prefix}, field("value", optional($.value)))`),
      ),
      testCase(
        "nullable aliased remaining branch",
        fixture.replace(shortBranch, `seq(${prefix}, alias(optional($.value), $.value))`),
      ),
      testCase("empty string remaining branch", fixture.replace(shortBranch, `seq(${prefix}, "")`)),
      testCase(
        "duplicate remaining branches",
        fixture.replace(shortBranch, `${shortBranch}, ${shortBranch}`),
      ),
      testCase(
        "multiple local uses",
        fixture.replace(
          "__function_forward_head:",
          "other: ($) => $.__function_forward_tail,\n__function_forward_head:",
        ),
      ),
      testCase("unused helper", fixture.replace(use, "$.other")),
      ...[
        "$.__function_forward_tail",
        'field("outer", optional($.__function_forward_tail))',
        "alias(optional($.__function_forward_tail), $.tail)",
        "token(optional($.__function_forward_tail))",
        "token.immediate(optional($.__function_forward_tail))",
        "prec.dynamic(1, optional($.__function_forward_tail))",
        "prec.right(binding, optional($.__function_forward_tail))",
        "custom(optional($.__function_forward_tail))",
        'optional($["__function_forward_tail"])',
        "optional($[name])",
      ].map((replacement) =>
        testCase(`unsafe caller: ${replacement}`, fixture.replace(use, replacement)),
      ),
      ...[
        "token($._routine_access_modifier)",
        "token.immediate($._routine_access_modifier)",
        "prec.dynamic(1, $._routine_access_modifier)",
        "custom($._routine_access_modifier)",
        'kw("PRIVATE", settings)',
      ].map((replacement) =>
        testCase(
          `unsafe suffix: ${replacement}`,
          fixture.replace(shortBranch, `seq(${prefix}, ${replacement})`),
        ),
      ),
      testCase("non-rule reference", `${fixture}\nconst other = ($) => $.__function_forward_tail;`),
      testCase("dynamic unrelated reference", `${fixture}\nconst other = ($) => $[name];`),
      testCase(
        "recursive dependency",
        fixture.replace(
          "__function_forward_head:",
          "__function_extent_phrase: ($) => $.__function_forward_tail,\n__function_forward_head:",
        ),
      ),
      testCase(
        "caller recursion",
        fixture.replace(
          "alias($.__function_parameters, $.parameters)",
          "$.__function_forward_head",
        ),
      ),
      ...["alias", "token", "token.immediate", "prec.dynamic"].map((wrapper) =>
        testCase(
          `restricted owner through ${wrapper}`,
          fixture.replace(
            "__function_forward_head:",
            `outer: ($) => ${wrapper}(${wrapper === "prec.dynamic" ? "1, " : ""}$.__function_forward_head${wrapper === "alias" ? ", $.head" : ""}),\n__function_forward_head:`,
          ),
        ),
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
        ["__function_forward_tail", "__function_forward_head"].map((symbol) =>
          testCase(`${metadata} metadata: ${symbol}`, metadataCase(metadata, symbol)),
        ),
      ),
      ...[
        "__function_forward_tail:",
        "__function_forward_head:",
        "choice(",
        prefix,
        "optional($._routine_access_modifier)",
        "alias($.__function_parameters, $.parameters)",
        shortBranch,
        "      $.__function_extent_phrase,",
        use,
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          fixture.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/optional-choice-prefix-hoist\n${part}`,
          ),
        ),
      ),
    ],
    invalid: [
      { ...testCase("measured FUNCTION forward tail"), errors: [{ message }] },
      {
        ...testCase(
          "renamed rules",
          fixture
            .replaceAll("function", "declaration")
            .replaceAll("extent_phrase", "storage")
            .replaceAll("routine_access_modifier", "visibility"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "additional prefixed alternative",
          fixture.replace(shortBranch, `${shortBranch}, seq(${prefix}, $.additional)`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "field-wrapped suffix",
          fixture.replace(shortBranch, `seq(${prefix}, field("value", $.value))`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static suffix precedence",
          fixture.replace(shortBranch, `seq(${prefix}, prec.right("binding", $.value))`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static caller precedence",
          fixture.replace(
            "seq($.__function_signature, optional($.__function_forward_tail))",
            'prec.right("binding", seq($.__function_signature, optional($.__function_forward_tail)))',
          ),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "metadata-looking comments",
          `// inline: ($) => [$.__function_forward_tail]\n${fixture}`,
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "statements", "function.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const metadata of [
    "inline",
    "conflicts",
    "precedences",
    "supertypes",
    "externals",
    "extras",
  ]) {
    for (const symbol of ["__function_forward_tail", "__function_forward_head"]) {
      writeFileSync(
        join(directory, "grammar.js"),
        `export default grammar({ ${metadata}: ($) => [$.${symbol}] });`,
      );
      new RuleTester().run("optional-choice-prefix-hoist", optionalChoicePrefixHoist, {
        valid: [moduleCase(`${metadata} dependency in project root: ${symbol}`)],
        invalid: [],
      });
    }
  }
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.__function_forward_tail, $.other]];",
  );
  new RuleTester().run("optional-choice-prefix-hoist", optionalChoicePrefixHoist, {
    valid: [moduleCase("precedence dependency in another module")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
