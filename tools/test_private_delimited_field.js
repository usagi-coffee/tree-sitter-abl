import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { multiUsePrivateDelimitedFieldInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-private-delimited-field-"));
const sequence = 'seq("(", field("amount", $.expression), ")")';
const before = `export default grammar({ rules: {
  first: ($) => seq("A", optional($.__amount)),
  second: ($) => prec.right(seq("B", $.__amount)),
  __amount: ($) => ${sequence},
} });`;
const fixture = readFileSync(new URL("./fixtures/put-count-inline.js", import.meta.url), "utf8");
const testCase = (name, code) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});
const message =
  /one delimited field.*unaliased local uses.*grammar.inline.*both delimiters.*optionality.*aliases and precedence.*actions, table bytes, memory and parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run(
    "multi-use-private-delimited-field-inline",
    multiUsePrivateDelimitedFieldInline,
    {
      valid: [
        testCase("public rule", before.replaceAll("__amount", "amount")),
        testCase("shared rule", before.replaceAll("__amount", "_amount")),
        testCase("single local use", before.replace("optional($.__amount)", "$.expression")),
        testCase("unused helper", before.replaceAll("$.__amount", "$.expression")),
        testCase(
          "mismatched delimiters",
          before.replace(
            'field("amount", $.expression), ")"',
            'field("amount", $.expression), "]"',
          ),
        ),
        testCase(
          "keyword delimiters",
          before.replace(sequence, 'seq("BEGIN", field("amount", $.expression), "END")'),
        ),
        testCase("no field", before.replace('field("amount", $.expression)', "$.expression")),
        testCase(
          "optional field",
          before.replace(
            'field("amount", $.expression)',
            'optional(field("amount", $.expression))',
          ),
        ),
        testCase(
          "nullable field contents",
          before.replace(
            'field("amount", $.expression)',
            'field("amount", optional($.expression))',
          ),
        ),
        testCase(
          "field choice",
          before.replace(
            'field("amount", $.expression)',
            'field("amount", choice($.expression, $.name))',
          ),
        ),
        testCase("dynamic field name", before.replace('field("amount",', "field(fieldName,")),
        testCase(
          "extra sequence member",
          before.replace(sequence, 'seq("(", field("amount", $.expression), $.modifier, ")")'),
        ),
        testCase(
          "recursive field",
          before.replace('field("amount", $.expression)', 'field("amount", $.__amount)'),
        ),
        testCase("precedence on helper", before.replace(sequence, `prec.right(${sequence})`)),
        testCase("lexical body", before.replace(sequence, `token(${sequence})`)),
        ...["alias", "field", "token", "token.immediate", "prec.dynamic"].map((wrapper) =>
          testCase(
            `${wrapper} at a use`,
            before.replace(
              "optional($.__amount)",
              wrapper === "alias"
                ? "alias($.__amount, $.amount)"
                : wrapper === "field"
                  ? 'field("outer", $.__amount)'
                  : wrapper === "prec.dynamic"
                    ? "prec.dynamic(1, $.__amount)"
                    : `${wrapper}($.__amount)`,
            ),
          ),
        ),
        testCase(
          "dynamic call-site precedence",
          before.replace('prec.right(seq("B",', 'prec.right(binding, seq("B",'),
        ),
        testCase("non-rule reference", `${before}\nfunction use($) { return $.__amount; }`),
        testCase(
          "computed reference",
          before.replace("optional($.__amount)", 'optional($["__amount"])'),
        ),
        testCase("dynamic reference", before.replace("optional($.__amount)", "optional($[name])")),
        ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras"].map(
          (metadata) =>
            testCase(
              `${metadata} dependency`,
              before.replace(
                "grammar({ rules:",
                `grammar({ ${metadata}: ($) => [ $.__amount ], rules:`,
              ),
            ),
        ),
        testCase(
          "word dependency",
          before.replace("grammar({ rules:", "grammar({ word: ($) => $.__amount, rules:"),
        ),
        ...[
          "__amount:",
          sequence,
          'field("amount", $.expression)',
          "first:",
          "optional($.__amount)",
        ].map((part) =>
          testCase(
            `rule-specific suppression at ${part}`,
            before.replace(
              part,
              `\n// oxlint-disable-next-line rule-to-test/multi-use-private-delimited-field-inline\n${part}`,
            ),
          ),
        ),
      ],
      invalid: [
        { ...testCase("two unaliased local uses", before), errors: [{ message }] },
        { ...testCase("measured PUT count helper", fixture), errors: [{ message }] },
        {
          ...testCase(
            "renamed helper and field",
            before
              .replaceAll("__amount", "__demo_payload")
              .replace('field("amount",', 'field("payload",'),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "brackets",
            before.replace(sequence, 'seq("[", field("amount", $.expression), "]")'),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "braces",
            before.replace(sequence, 'seq("{", field("amount", $.expression), "}")'),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "private consumers",
            before.replace("first:", "__first:").replace("second:", "__second:"),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "three consumers",
            before.replace("__amount:", "third: ($) => repeat1($.__amount), __amount:"),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "two uses in one owner",
            before
              .replace("optional($.__amount)", "seq($.__amount, optional($.__amount))")
              .replace('second: ($) => prec.right(seq("B", $.__amount)),', ""),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "static precedence and repetition",
            before.replace("optional($.__amount)", 'prec.left("items", repeat1($.__amount))'),
          ),
          errors: [{ message }],
        },
        {
          ...testCase(
            "unrelated suppression",
            before.replace(
              "__amount:",
              "// oxlint-disable-next-line tree-sitter-optimize/closing-delimiter-hoist\n__amount:",
            ),
          ),
          errors: [{ message }],
        },
      ],
    },
  );

  const moduleCase = (name) => ({
    ...testCase(name, before),
    filename: join(directory, "grammar", "statements", "demo.js"),
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__amount] });",
  );
  new RuleTester().run(
    "multi-use-private-delimited-field-inline",
    multiUsePrivateDelimitedFieldInline,
    {
      valid: [moduleCase("inline metadata in project root")],
      invalid: [],
    },
  );
  writeFileSync(join(directory, "grammar.js"), "export default grammar({ rules: {} });");
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    "export default ($) => [[$.__amount, $.other]];",
  );
  new RuleTester().run(
    "multi-use-private-delimited-field-inline",
    multiUsePrivateDelimitedFieldInline,
    {
      valid: [moduleCase("precedence dependency in another module")],
      invalid: [],
    },
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "demo.js"),
    '// $.__amount is only documentation.\nexport default ($) => [["__amount", $.other]];',
  );
  new RuleTester().run(
    "multi-use-private-delimited-field-inline",
    multiUsePrivateDelimitedFieldInline,
    {
      valid: [],
      invalid: [
        { ...moduleCase("comments and strings are not dependencies"), errors: [{ message }] },
      ],
    },
  );
} finally {
  rmSync(directory, { recursive: true, force: true });
}
