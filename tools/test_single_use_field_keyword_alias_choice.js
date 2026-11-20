import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseFieldKeywordAliasChoice } from "../oxlint/index.js";

const name = "single-use-field-keyword-alias-choice";
const directory = mkdtempSync(join(tmpdir(), "abl-single-use-field-keyword-alias-choice-"));
const helper = "__put_assign_type";
const use = `$.${helper}`;
const field = `field("type", ${use})`;
const choices = [
  "BYTE",
  "BYTES",
  "BITS",
  "SHORT",
  "LONG",
  "UNSIGNED-SHORT",
  "UNSIGNED-LONG",
  "INT64",
  "FLOAT",
  "DOUBLE",
  "STRING",
].map((type) => `alias(kw("PUT-${type}"), $.identifier)`);
const body = `choice(${choices.join(", ")})`;
const caller = `seq(${field}, "(", field("buffer", $._expression), $._comma_position_length, $._close_equals_value)`;
const before = `export default ({ kw }) => ({
  put_assign_statement: ($) => seq($.__put_assign_prefix, $._terminator),
  __put_assign_prefix: ($) => ${caller},
  ${helper}: ($) => ${body},
});`;
const test = (description, code = before) => ({
  name: description,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "put-assign.js"),
});
const warning = {
  message: /__put_assign_type has one local use inside the type field.*identifier aliases/,
};
const tester = new RuleTester();

try {
  tester.run(name, singleUseFieldKeywordAliasChoice, {
    valid: [
      test(
        "inline the complete choice within the field",
        before
          .replace(field, `field("type", ${body})`)
          .replace(`  ${helper}: ($) => ${body},\n`, ""),
      ),
      test("visible choice", before.replaceAll(helper, "put_assign_type")),
      test("shared choice", before.replaceAll(helper, "_put_assign_type")),
      test("body rule", before.replaceAll(helper, "__put_assign_body")),
      test("one alternative", before.replace(body, `choice(${choices[0]})`)),
      test("bare keyword alternative", before.replace(choices[0], 'kw("PUT-BYTE")')),
      test("symbol alternative", before.replace(choices[0], "$.identifier")),
      test("hidden alias target", before.replaceAll("$.identifier", "$._identifier")),
      test("different alias targets", before.replace("$.identifier", "$.byte_type")),
      test("dynamic keyword", before.replace('kw("PUT-BYTE")', "kw(keyword)")),
      test("dynamic options", before.replace('kw("PUT-BYTE")', 'kw("PUT-BYTE", options)')),
      test("precedence on the helper", before.replace(body, `prec.right(${body})`)),
      test("use outside a field", before.replace(field, use)),
      test("use inside a compound field", before.replace(field, `field("type", optional(${use}))`)),
      test("dynamic field name", before.replace(field, `field(typeField, ${use})`)),
      test("computed field value", before.replace(use, `$["${helper}"]`)),
      test("second use", before.replace(field, `seq(${field}, ${use})`)),
      test("computed second use", `${before}\nconst extra = ($) => $["${helper}"];`),
      test("dynamic second use", `${before}\nconst extra = ($) => $[key];`),
      test("spread in the rule map", before.replace(`${helper}:`, `...rules, ${helper}:`)),
      test(
        "duplicate helper",
        before.replace(`${helper}:`, `${helper}: ($) => $.other, ${helper}:`),
      ),
      test(
        "reference in local precedence metadata",
        before
          .replace(
            "export default ({ kw }) => ({",
            `export default grammar({ precedences: ($) => [[${use}]], rules: {`,
          )
          .replace("});", "}});"),
      ),
      ...[
        `alias(${field}, $.other)`,
        `token(${field})`,
        `token.immediate(${field})`,
        `prec.dynamic(1, ${field})`,
        `field("outer", ${field})`,
        `custom(${field})`,
      ].map((wrapper) => test(`field wrapped in ${wrapper}`, before.replace(field, wrapper))),
      ...[`${helper}:`, body, choices[0], field, "__put_assign_prefix:"].map((part) =>
        test(
          `suppressed at ${part}`,
          before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${name}\n${part}`),
        ),
      ),
    ],
    invalid: [
      { ...test("PUT type keyword aliases in a direct field"), errors: [warning] },
      {
        ...test(
          "static keyword options and caller precedence",
          before
            .replace('kw("PUT-BYTE")', 'kw("PUT-BYTE", {offset: 5, alias: "PUT-B"})')
            .replace(field, `prec.right("assignment", ${field})`),
        ),
        errors: [warning],
      },
    ],
  });

  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const [filename, code] of [
    ["grammar.js", `export default grammar({ inline: ($) => [${use}] });`],
    ["grammar.js", `export default grammar({ word: ($) => ${use} });`],
    ["grammar/precedences/example.js", `export default ($) => [[${use}]];`],
    ["grammar/other.js", `export default () => ({ other: ($) => $["${helper}"] });`],
  ]) {
    const path = join(directory, filename);
    writeFileSync(path, code);
    tester.run(name, singleUseFieldKeywordAliasChoice, {
      valid: [test(`external reference in ${filename}: ${code}`)],
      invalid: [],
    });
    rmSync(path);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
