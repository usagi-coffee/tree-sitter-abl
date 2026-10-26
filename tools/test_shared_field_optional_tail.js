import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { sharedFieldOptionalTailInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-shared-field-tail-"));
const sequence = 'seq(field("target", $.identifier), optional($._qualifier))';
const before = `export default grammar({ rules: {
  first: ($) => seq("A", $._target),
  second: ($) => prec.right(seq("B", optional($._target))),
  _target: ($) => ${sequence},
} });`;
const fixture = readFileSync(new URL("./fixtures/create-pool-inline.js", import.meta.url), "utf8");
const testCase = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /shared field followed by an optional hidden tail.*grammar.inline.*cross-file use.*aliases, fields and metadata.*required field, optional tail and caller precedence.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("shared-field-optional-tail-inline", sharedFieldOptionalTailInline, {
    valid: [
      testCase("public helper", before.replaceAll("_target", "target")),
      testCase("private helper", before.replaceAll("_target", "__target")),
      ...[
        "seq($.identifier, optional($._qualifier))",
        'seq(optional(field("target", $.identifier)), optional($._qualifier))',
        'seq(field("target", optional($.identifier)), optional($._qualifier))',
        'seq(field("target", choice($.identifier, $.expression)), optional($._qualifier))',
        "seq(field(name, $.identifier), optional($._qualifier))",
        'seq(field("target", $.identifier), $._qualifier)',
        'seq(field("target", $.identifier), optional($.qualifier))',
        'seq(field("target", $.identifier), optional(choice($._qualifier, $._other)))',
        'seq(field("target", $.identifier), optional($._qualifier), ".")',
        'seq(field("target", $._target), optional($._qualifier))',
        'seq(field("target", $.identifier), optional($._target))',
        `prec.right(${sequence})`,
        `token(${sequence})`,
      ].map((body) => testCase(`unsupported body: ${body}`, before.replace(sequence, body))),
      ...[
        "alias($._target, $.target)",
        'field("outer", $._target)',
        "token($._target)",
        "token.immediate($._target)",
        "prec.dynamic(1, $._target)",
        "prec.right(binding, $._target)",
        "custom($._target)",
        'alias(seq($._target, "."), $.target)',
        '$["_target"]',
        "$[name]",
      ].map((use) =>
        testCase(`unsafe local use: ${use}`, before.replace('seq("A", $._target)', use)),
      ),
      testCase("non-rule reference", `${before}\nconst reference = ($) => $._target;`),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].map(
        (metadata) =>
          testCase(
            `${metadata} dependency`,
            before.replace("grammar({ rules:", `grammar({ ${metadata}: ($) => [$._target], rules:`),
          ),
      ),
      testCase(
        "word dependency",
        before.replace("grammar({ rules:", "grammar({ word: ($) => $._target, rules:"),
      ),
      ...[
        "_target:",
        sequence,
        'field("target",',
        "optional($._qualifier)",
        "first:",
        'seq("A",',
      ].map((part) =>
        testCase(
          `rule-specific suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/shared-field-optional-tail-inline\n${part}`,
          ),
        ),
      ),
      testCase(
        "measured CREATE helper after metadata inlining",
        fixture.replace("grammar({", "grammar({ inline: ($) => [$._handle_in_widget_pool],"),
      ),
    ],
    invalid: [
      { ...testCase("shared field and optional hidden tail"), errors: [{ message }] },
      { ...testCase("measured CREATE helper", fixture), errors: [{ message }] },
      {
        ...testCase(
          "renamed helper, field and tail",
          before
            .replaceAll("_target", "_destination")
            .replaceAll("target", "destination")
            .replaceAll("_qualifier", "_location"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "shared declaration consumed in other modules",
          `export default ({ kw }) => ({ _target: ($) => ${sequence} });`,
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "one visible local consumer",
          before.replace('second: ($) => prec.right(seq("B", optional($._target))),', ""),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "static caller precedence and repetition",
          before.replace('seq("A", $._target)', 'prec.left("items", repeat1($._target))'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("private optional tail", before.replaceAll("_qualifier", "__qualifier")),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(
            "_target:",
            "// oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline\n_target:",
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
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$._target] });",
  );
  new RuleTester().run("shared-field-optional-tail-inline", sharedFieldOptionalTailInline, {
    valid: [moduleCase("inline metadata in project root")],
    invalid: [],
  });
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$._target, $.other]];",
  );
  new RuleTester().run("shared-field-optional-tail-inline", sharedFieldOptionalTailInline, {
    valid: [moduleCase("precedence dependency in another module")],
    invalid: [],
  });
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $._target is documentation.\nexport default ($) => [["_target", $.other]];',
  );
  new RuleTester().run("shared-field-optional-tail-inline", sharedFieldOptionalTailInline, {
    valid: [],
    invalid: [
      { ...moduleCase("comments and strings do not add dependencies"), errors: [{ message }] },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
