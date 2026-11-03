import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { sharedKeywordPairFieldInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-shared-keyword-pair-"));
const sequence = 'seq($._kw_for, kw("TENANT"), field("tenant", $._expression))';
const before = `export default grammar({ rules: {
  first: ($) => seq("A", optional($._tenant)),
  second: ($) => prec.right(seq("B", $._tenant)),
  _tenant: ($) => ${sequence},
} });`;
const fixture = readFileSync(new URL("./fixtures/for-tenant-inline.js", import.meta.url), "utf8");
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /shared keyword pair followed by a required field.*grammar.inline.*cross-file uses, aliases, recursion and metadata.*both keywords, token identities, field scope and caller precedence.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("shared-keyword-pair-field-inline", sharedKeywordPairFieldInline, {
    valid: [
      ...["tenant", "__tenant", "_kw_tenant", "_tenant_body"].map((name) =>
        testCase(`unsupported helper name: ${name}`, before.replaceAll("_tenant", name)),
      ),
      ...[
        'seq(kw("TENANT"), field("tenant", $._expression))',
        'seq($._kw_for, kw("TENANT"), field("tenant", $._expression), ".")',
        'seq($.identifier, kw("TENANT"), field("tenant", $._expression))',
        'seq($._kw_for, optional(kw("TENANT")), field("tenant", $._expression))',
        'seq($._kw_for, kw(name), field("tenant", $._expression))',
        'seq($._kw_for, kw("TENANT", settings), field("tenant", $._expression))',
        'seq($._kw_for, kw("TENANT", { offset: minimum }), field("tenant", $._expression))',
        'seq($._kw_for, kw("TENANT"), $._expression)',
        'seq($._kw_for, kw("TENANT"), optional(field("tenant", $._expression)))',
        'seq($._kw_for, kw("TENANT"), field("tenant", optional($._expression)))',
        'seq($._kw_for, kw("TENANT"), field("tenant", choice($.identifier, $.number_literal)))',
        'seq($._kw_for, kw("TENANT"), field(name, $._expression))',
        'seq($._kw_for, kw("TENANT"), field("tenant", $._tenant))',
        `prec.right(${sequence})`,
        `token(${sequence})`,
      ].map((body) => testCase(`unsupported body: ${body}`, before.replace(sequence, body))),
      testCase(
        "indirect recursion",
        before.replace("_tenant:", "_expression: ($) => $._tenant,\n_tenant:"),
      ),
      testCase(
        "dynamic local dependency",
        before.replace("_tenant:", "_expression: ($) => makeExpression($),\n_tenant:"),
      ),
      ...[
        "alias($._tenant, $.tenant)",
        'field("outer", $._tenant)',
        "token($._tenant)",
        "token.immediate($._tenant)",
        "prec.dynamic(1, $._tenant)",
        "prec.right(binding, $._tenant)",
        "custom($._tenant)",
        'alias(seq($._tenant, "."), $.tenant)',
        '$["_tenant"]',
        "$[name]",
      ].map((use) =>
        testCase(`unsafe local use: ${use}`, before.replace("optional($._tenant)", use)),
      ),
      testCase("non-rule reference", `${before}\nconst reference = ($) => $._tenant;`),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].map(
        (metadata) =>
          testCase(
            `${metadata} dependency`,
            before.replace("grammar({ rules:", `grammar({ ${metadata}: ($) => [$._tenant], rules:`),
          ),
      ),
      testCase(
        "word dependency",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $._tenant, rules:"),
      ),
      ...[
        "_tenant:",
        sequence,
        'kw("TENANT")',
        'field("tenant",',
        "first:",
        "optional($._tenant)",
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/shared-keyword-pair-field-inline\n${part}`,
          ),
        ),
      ),
      testCase(
        "measured helper after metadata inlining",
        fixture.replace("grammar({", "grammar({ inline: ($) => [$._for_tenant],"),
      ),
    ],
    invalid: [
      { ...testCase("shared keyword pair and field"), errors: [{ message }] },
      { ...testCase("measured FOR TENANT helper", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed keywords, helper and field",
          before
            .replaceAll("_kw_for", "_kw_in")
            .replaceAll("TENANT", "REGION")
            .replaceAll("tenant", "region"),
        ),
        errors: [{ message }],
      },
      ...[
        sequence.replace("$._kw_for", 'kw("FOR")'),
        sequence.replace('kw("TENANT")', "$._kw_tenant"),
        sequence.replace('kw("TENANT")', 'kw("TENANTS", { alias: "TENANT", offset: 6 })'),
        sequence.replace("$._expression", "$.identifier"),
      ].map((body) => ({
        ...testCase(`keyword or value variant: ${body}`, before.replace(sequence, body)),
        errors: [{ message }],
      })),
      {
        ...testCase(
          "shared helper used by other modules",
          `export default ({ kw }) => ({ _tenant: ($) => ${sequence} });`,
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static caller precedence and repetition",
          before.replace('seq("A", optional($._tenant))', 'prec.left("items", repeat1($._tenant))'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            "_tenant:",
            "// oxlint-disable-next-line tree-sitter-optimize/shared-keyword-field-inline\n_tenant:",
          ),
        ),
        errors: [{ message }],
      },
    ],
  });

  const moduleCase = (name) => ({
    ...testCase(name),
    filename: join(directory, "grammar", "core", "common.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const metadata of ["inline", "conflicts", "supertypes", "externals", "extras"]) {
    writeFileSync(
      join(directory, "grammar.js"),
      `export default grammar({ ${metadata}: ($) => [$._tenant] });`,
    );
    new RuleTester().run("shared-keyword-pair-field-inline", sharedKeywordPairFieldInline, {
      valid: [moduleCase(`${metadata} metadata in project root`)],
      invalid: [],
    });
  }
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$._tenant, $.other]];",
  );
  new RuleTester().run("shared-keyword-pair-field-inline", sharedKeywordPairFieldInline, {
    valid: [moduleCase("precedence dependency in another module")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $._tenant is documentation.\nexport default ($) => [["_tenant", $.other]];',
  );
  new RuleTester().run("shared-keyword-pair-field-inline", sharedKeywordPairFieldInline, {
    valid: [],
    invalid: [
      { ...moduleCase("comments and strings do not add dependencies"), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
