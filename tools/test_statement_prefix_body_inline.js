import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { statementPrefixBodyInline } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-statement-prefix-body-"));
const wrapper = "__prompt_for_statement_body";
const use = `$.${wrapper}`;
const parts = "$.__prompt_for_prefix, $.__prompt_for_body";
const caller = `seq(${use}, $._terminator)`;
const combination = `seq(${parts})`;
const before = `export default ({ kw }) => ({
  prompt_for_statement: ($) => ${caller},
  ${wrapper}: ($) => ${combination},
  __prompt_for_prefix: ($) =>
    seq(kw("PROMPT-FOR"), optional($._stream_phrase), optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden))),
  __prompt_for_body: ($) => choice($.__prompt_for_record, $.__prompt_for_fields),
  __prompt_for_record: ($) => field("record", $.identifier),
  __prompt_for_fields: ($) =>
    seq(field("field", $._qualified_identifier), optional($.__prompt_for_fields)),
});`;
const testCase = (name, code = before, cwd = directory) => ({
  name,
  code,
  cwd,
  filename: join(cwd, "grammar", "statements", "prompt-for.js"),
});
const name = "statement-prefix-body-inline";
const tester = new RuleTester();
const message =
  /Try inlining __\w+_statement_body into \w+_statement before its terminator.*prefix and body rules, option order, and precedence.*parser metrics, parsing speed, and complete valid and recovery trees/;
const warn = (description, code) => ({ ...testCase(description, code), errors: [{ message }] });

try {
  tester.run(name, statementPrefixBodyInline, {
    valid: [
      testCase(
        "measured expansion",
        before
          .replace(caller, `seq(${parts}, $._terminator)`)
          .replace(`  ${wrapper}: ($) => ${combination},\n`, ""),
      ),
      testCase("public wrapper", before.replaceAll(wrapper, "prompt_for_statement_body")),
      testCase("shared wrapper", before.replaceAll(wrapper, "_prompt_for_statement_body")),
      testCase(
        "hidden statement",
        before.replaceAll("prompt_for_statement:", "_prompt_for_statement:"),
      ),
      testCase("unexpected terminator", before.replace("$._terminator", "$._colon")),
      testCase(
        "additional statement segment",
        before.replace(caller, `seq(${use}, $.flag, $._terminator)`),
      ),
      testCase(
        "reordered combination",
        before.replace(parts, "$.__prompt_for_body, $.__prompt_for_prefix"),
      ),
      testCase("additional combined part", before.replace(parts, `${parts}, optional($.flag)`)),
      testCase(
        "extra use",
        before.replace('field("record", $.identifier)', `field("record", ${use})`),
      ),
      testCase("external local use", `${before}\nconst sample = ($) => ${use};`),
      testCase("computed local use", `${before}\nconst sample = ($) => $["${wrapper}"];`),
      testCase("dynamic local use", `${before}\nconst sample = ($) => $[name];`),
      testCase(
        "duplicate wrapper",
        before.replace(`${wrapper}:`, `${wrapper}: ($) => $.other, ${wrapper}:`),
      ),
      testCase(
        "uncertain definition from spread",
        before.replace(`${wrapper}:`, `...rules, ${wrapper}:`),
      ),
      testCase("recursive wrapper", before.replace(parts, `$.__prompt_for_prefix, ${use}`)),
      testCase(
        "local dependency references visible owner",
        before.replace("optional($.__prompt_for_fields)", "optional($.prompt_for_statement)"),
      ),
      testCase(
        "local dependency is dynamic",
        before.replace('field("record", $.identifier)', "getRecord($)"),
      ),
      testCase("prefix is not keyword-led", before.replace('kw("PROMPT-FOR")', "$.identifier")),
      testCase(
        "body is not a choice",
        before.replace("choice($.__prompt_for_record,", "seq($.__prompt_for_record,"),
      ),
      ...[
        `alias(${use}, $.body)`,
        `field("body", ${use})`,
        `optional(${use})`,
        `prec.right(${use})`,
        `token(${use})`,
      ].map((part) =>
        testCase(
          `unsafe wrapper use: ${part}`,
          before.replace(caller, `seq(${part}, $._terminator)`),
        ),
      ),
      testCase(
        "combined part has a field",
        before.replace(parts, 'field("prefix", $.__prompt_for_prefix), $.__prompt_for_body'),
      ),
      testCase(
        "local metadata uses visible owner",
        before
          .replace(
            "export default ({ kw }) => ({",
            `export default grammar({
    conflicts: ($) => [[$.prompt_for_statement, $.other]],
    rules: {`,
          )
          .replace("});", "} });"),
      ),
      ...[caller, combination, `${wrapper}:`].map((part) =>
        testCase(
          `suppression at ${part}`,
          before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${name}\n${part}`),
        ),
      ),
    ],
    invalid: [
      warn("direct prefix and body references before terminator", before),
      warn(
        "SET shape with a keyword helper and NO-ERROR terminator",
        before
          .replaceAll("prompt_for", "set")
          .replace('kw("PROMPT-FOR")', "$._kw_set")
          .replace("$._terminator", "$._no_error_terminator")
          .replace("choice($.__set_record,", "choice($._set_update_record_body,"),
      ),
    ],
  });

  const grammar = join(directory, "grammar");
  mkdirSync(join(grammar, "precedences"), { recursive: true });
  const root = join(directory, "grammar.js");
  const precedence = join(grammar, "precedences", "example.js");
  writeFileSync(root, `export default grammar({ inline: ($) => [${use}] });`);
  tester.run(name, statementPrefixBodyInline, {
    valid: [testCase("root inline metadata")],
    invalid: [],
  });
  writeFileSync(root, "export default grammar({});");
  writeFileSync(precedence, "export default ($) => [[$.prompt_for_statement, $.other]];");
  tester.run(name, statementPrefixBodyInline, {
    valid: [testCase("project precedence metadata")],
    invalid: [],
  });
  rmSync(precedence);
  writeFileSync(join(grammar, "other.js"), `export default () => ({ extra: ($) => ${use} });`);
  tester.run(name, statementPrefixBodyInline, {
    valid: [testCase("cross-file wrapper use")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
