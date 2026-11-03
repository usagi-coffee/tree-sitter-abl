import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { existingAlternativeBodyReuse } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-existing-alternative-"));
const body =
  'seq(alias(kw("OVERRIDE"), $.override_modifier), optional($._access), optional($._serialization))';
const before = `export default grammar({ rules: {
  entry: ($) => seq(optional($.__owner), "."),
  __owner: ($) => choice(seq("PREFIX", optional($.__tail)), ${body}, $.other),
  __tail: ($) => ${body},
} });`;
const fixture = readFileSync(
  new URL("./fixtures/property-modifier-tail-reuse.js", import.meta.url),
  "utf8",
);
const testCase = (name, code = before, cwd = directory, filename = "grammar.js") => ({
  name,
  code,
  cwd,
  filename: join(cwd, filename),
});
const message =
  /already appears in another branch.*exact non-recursive sequence.*only the expanded branch.*existing hidden helper.*fields, aliases, token identities, optionality and branch order.*cross-file references and metadata.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;
const metadataCase = (metadata, symbol) =>
  before.replace("grammar({ rules:", `grammar({ ${metadata}: ($) => [$.${symbol}], rules:`);

try {
  new RuleTester().run("existing-alternative-body-reuse", existingAlternativeBodyReuse, {
    valid: [
      testCase("retained helper replaces the expanded branch", before.replace(body, "$.__tail")),
      testCase("public helper", before.replaceAll("__tail", "tail")),
      testCase("shared helper", before.replaceAll("__tail", "_tail")),
      testCase("public owner", before.replaceAll("__owner", "owner")),
      testCase("no sibling use", before.replace("optional($.__tail)", "optional($.unrelated)")),
      testCase(
        "helper is referenced outside the choice only",
        before
          .replace("optional($.__tail)", "optional($.unrelated)")
          .replace('seq(optional($.__owner), ".")', 'seq($.__tail, optional($.__owner), ".")'),
      ),
      testCase("missing local helper", before.replace(`__tail: ($) => ${body},`, "")),
      testCase(
        "different suffix order",
        before.replace(
          body,
          body.replace(
            "optional($._access), optional($._serialization)",
            "optional($._serialization), optional($._access)",
          ),
        ),
      ),
      testCase(
        "different keyword options",
        before.replace('kw("OVERRIDE")', 'kw("OVERRIDE", { offset: 4 })'),
      ),
      testCase("different alias", before.replace("$.override_modifier", "$.other_modifier")),
      testCase("different optionality", before.replace("optional($._access)", "$._access")),
      testCase(
        "different sequence length",
        before.replace(body, body.replace("seq(", 'seq("EXTRA", ')),
      ),
      ...[
        "seq(optional($.first), optional($.second))",
        'seq("", optional($.second))',
        'seq(field("first", optional($.first)), alias(optional($.second), $.second))',
        'seq(token("OVERRIDE"), optional($.second))',
        'seq(token.immediate("OVERRIDE"), optional($.second))',
        "seq(prec.dynamic(1, $.first), optional($.second))",
        "seq(kw(command), optional($.second))",
        'seq(kw("OVERRIDE", options), optional($.second))',
        'seq(kw("OVERRIDE", { offset: minimum }), optional($.second))',
        "seq($.first, ...suffix)",
        "seq($.first, optional($.__tail))",
        "seq($.first, $.__owner)",
      ].map((replacement) =>
        testCase(`unsupported body: ${replacement}`, before.replaceAll(body, replacement)),
      ),
      testCase("indirect cycle", before.replace("__tail:", "_access: ($) => $.__tail, __tail:")),
      testCase(
        "dependency reaches owner",
        before.replace("__tail:", "_access: ($) => $.__owner, __tail:"),
      ),
      testCase(
        "dynamic local dependency",
        before.replace("__tail:", "_access: ($) => buildAccess($), __tail:"),
      ),
      ...[
        `alias(${body}, $.tail)`,
        `field("tail", ${body})`,
        `token(${body})`,
        `token.immediate(${body})`,
        `prec.dynamic(1, ${body})`,
        `prec.right(${body})`,
      ].map((replacement) =>
        testCase(`wrapped alternative: ${replacement}`, before.replace(body, replacement)),
      ),
      ...[
        "alias(BODY, $.modifiers)",
        'field("modifiers", BODY)',
        "token(BODY)",
        "token.immediate(BODY)",
        "prec.dynamic(1, BODY)",
        "prec.right(binding, BODY)",
        "custom(BODY)",
      ].map((wrapper) =>
        testCase(
          `unsafe choice context: ${wrapper}`,
          before.replace(
            `choice(seq("PREFIX", optional($.__tail)), ${body}, $.other)`,
            wrapper.replace("BODY", `choice(seq("PREFIX", optional($.__tail)), ${body}, $.other)`),
          ),
        ),
      ),
      testCase("computed reference", `${before}\nconst use = ($) => $["__tail"];`),
      testCase("dynamic reference", `${before}\nconst use = ($) => $[name];`),
      testCase("non-rule helper reference", `${before}\nconst use = ($) => $.__tail;`),
      testCase("non-rule owner reference", `${before}\nconst use = ($) => $.__owner;`),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].flatMap(
        (metadata) =>
          ["__tail", "__owner"].map((symbol) =>
            testCase(`${metadata} uses ${symbol}`, metadataCase(metadata, symbol)),
          ),
      ),
      testCase(
        "word helper dependency",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $.__tail, rules:"),
      ),
      ...["__owner:", "__tail:", body, 'alias(kw("OVERRIDE")', "optional($._access)"].map((part) =>
        testCase(
          `suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/existing-alternative-body-reuse\n${part}`,
          ),
        ),
      ),
      testCase(
        "file suppression",
        `// oxlint-disable rule-to-test/existing-alternative-body-reuse\n${before}`,
      ),
      testCase(
        "measured property branch after reuse",
        fixture.replace(
          '      seq(\n        alias(kw("OVERRIDE"), $.override_modifier),\n        optional($._member_access_modifier),\n        optional($._serialization_modifier),\n      ),',
          "      $.__class_property_modifier_tail,",
        ),
      ),
    ],
    invalid: [
      { ...testCase("already used private helper"), errors: [{ message }] },
      { ...testCase("measured property modifier branches", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed helper and owner",
          before.replaceAll("__tail", "__options").replaceAll("__owner", "__modifiers"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "exact keyword options",
          before.replaceAll('kw("OVERRIDE")', 'kw("OVERRIDE", { offset: 4, alias: "OVER" })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "exact fields and aliases",
          before.replaceAll(
            body,
            'seq(field("value", $.identifier), optional(alias($.clause, $.option)))',
          ),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static choice precedence",
          before.replace(
            `choice(seq("PREFIX", optional($.__tail)), ${body}, $.other)`,
            `prec.right("binding", choice(seq("PREFIX", optional($.__tail)), ${body}, $.other))`,
          ),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "non-recursive dependency",
          before.replace("__tail:", "_access: ($) => choice($.public, $.private), __tail:"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(body, `\n// oxlint-disable-next-line unrelated/rule\n${body}`),
        ),
        errors: [{ message }],
      },
    ],
  });

  const metadataDirectory = join(directory, "metadata");
  mkdirSync(join(metadataDirectory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(metadataDirectory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__tail] });",
  );
  new RuleTester().run("existing-alternative-body-reuse", existingAlternativeBodyReuse, {
    valid: [testCase("root inline metadata", before, metadataDirectory, "grammar/example.js")],
    invalid: [],
  });
  writeFileSync(join(metadataDirectory, "grammar.js"), "export default grammar({});");
  writeFileSync(
    join(metadataDirectory, "grammar", "precedences", "example.js"),
    "export default ($) => [[$.__owner, $.other]];",
  );
  new RuleTester().run("existing-alternative-body-reuse", existingAlternativeBodyReuse, {
    valid: [
      testCase("project precedence metadata", before, metadataDirectory, "grammar/example.js"),
    ],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
