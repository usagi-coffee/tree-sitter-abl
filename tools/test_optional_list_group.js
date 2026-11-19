import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseOptionalSequence } from "../oxlint/index.js";

const phrase = "optional($.delimiter_phrase)";
const list = "$._expression_list";
const tail = "optional($.__export_tail)";
const group = `seq(${phrase}, ${list}, ${tail})`;
const optionalUse = "optional($.__export_expressions_body)";
const caller = `seq($.__export_statement_head, ${optionalUse})`;
const definition = `__export_expressions_body: ($) => ${group},`;
const before = `export default grammar({ rules: {
  export_statement: ($) => seq($.__export_statement_body, $._terminator),
  __export_statement_body: ($) => ${caller},
  __export_statement_head: ($) => seq(kw("EXPORT"), optional($._stream_phrase)),
  ${definition}
  __export_tail: ($) => choice($.except, $.no_lobs),
} });`;
const suppression = "// oxlint-disable-next-line rule-to-test/single-use-optional-sequence";
const message =
  /one unaliased optional use at the end of.*inlining the optional phrase, required shared list and optional private continuation into the existing optional wrapper/;
const directory = mkdtempSync(join(tmpdir(), "abl-optional-list-group-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "export.js"),
});

try {
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__inline_body] });",
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "export.js"),
    "export default ($) => [[$.__precedence_body, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "consumer.js"),
    'export default () => ({consumer: ($) => $["__cross_module_body"]});',
  );

  new RuleTester().run("single-use-optional-sequence", singleUseOptionalSequence, {
    valid: [
      fixture(
        "inlined EXPORT group",
        before.replace(optionalUse, `optional(${group})`).replace(definition, ""),
      ),
      fixture("required use", before.replace(optionalUse, "$.__export_expressions_body")),
      fixture(
        "aliased use",
        before.replace(optionalUse, "optional(alias($.__export_expressions_body, $.group))"),
      ),
      fixture(
        "field-scoped use",
        before.replace(optionalUse, 'optional(field("group", $.__export_expressions_body))'),
      ),
      fixture("lexical use", before.replace(caller, `token(${caller})`)),
      fixture("precedence wrapper", before.replace(caller, `prec.right(${caller})`)),
      fixture(
        "nonfinal use",
        before.replace(caller, `seq(${optionalUse}, $.__export_statement_head)`),
      ),
      fixture("public caller", before.replaceAll("__export_statement_body", "export_body")),
      fixture(
        "nullable caller prefix",
        before.replace(
          'seq(kw("EXPORT"), optional($._stream_phrase))',
          "optional($._stream_phrase)",
        ),
      ),
      fixture(
        "nonlocal caller prefix",
        before.replace("$.__export_statement_head", "$.__foreign_prefix"),
      ),
      fixture("required leading phrase", before.replace(phrase, "$.delimiter_phrase")),
      fixture("hidden leading phrase", before.replace(phrase, "optional($._delimiter_phrase)")),
      fixture("optional list", before.replace(list, `optional(${list})`)),
      fixture("nonlist required rule", before.replace(list, "$._expression")),
      fixture("private list", before.replace(list, "$.__expression_list")),
      fixture("required continuation", before.replace(tail, "$.__export_tail")),
      fixture("public continuation", before.replace(tail, "optional($.export_tail)")),
      fixture("nonlocal private continuation", before.replace(tail, "optional($.__foreign_tail)")),
      fixture("multiple uses", before.replace(optionalUse, `${optionalUse}, ${optionalUse}`)),
      fixture(
        "computed second use",
        `${before}\nconst use = ($) => $["__export_expressions_body"];`,
      ),
      fixture("dynamic use", `${before}\nconst use = ($) => $[name];`),
      fixture("spread into rule map", before.replace("rules: {", "rules: { ...otherRules,")),
      fixture(
        "indirect recursion through the caller",
        before.replace("choice($.except, $.no_lobs)", "$.__export_statement_body"),
      ),
      fixture(
        "dynamic local dependency",
        before.replace("choice($.except, $.no_lobs)", "makeRule($)"),
      ),
      fixture("inline metadata", before.replaceAll("__export_expressions_body", "__inline_body")),
      fixture(
        "precedence metadata on caller",
        before.replaceAll("__export_statement_body", "__precedence_body"),
      ),
      fixture(
        "cross-file computed reference",
        before.replaceAll("__export_expressions_body", "__cross_module_body"),
      ),
      fixture(
        "same-file metadata on caller",
        before.replace("rules: {", "inline: ($) => [$.__export_statement_body], rules: {"),
      ),
      fixture(
        "definition suppression",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture(
        "callsite suppression",
        before.replace(optionalUse, `\n    ${suppression}\n    ${optionalUse},\n  `),
      ),
      fixture("phrase suppression", before.replace(phrase, `\n    ${suppression}\n    ${phrase}`)),
    ],
    invalid: [
      {
        ...fixture("optional EXPORT expression group"),
        errors: [{ message }],
      },
      {
        ...fixture(
          "the same structural group in another private body",
          before.replaceAll("export_", "print_").replace(list, "$._value_list"),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
