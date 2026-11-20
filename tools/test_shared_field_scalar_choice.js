import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { sharedFieldScalarChoice } from "../oxlint/index.js";

const name = "shared-field-scalar-choice";
const selector = "_identifier_or_string_literal";
const helper = "_identifier_or_string_literal_value";
const pair = "$.identifier, $.string_literal";
const database = `field("database", choice(${pair}, $.function_call))`;
const value = `field("value", choice(${pair}, $.number_literal))`;
const before = `export default () => ({
  __connect_prefix: ($) => seq(
    $._kw_connect,
    optional(${database}),
    repeat(seq("-", field("parameter", alias(token.immediate(/[a-z0-9_]+/i), $.identifier)), optional(${value}))),
  ),
});`;
const root = `export default grammar({
  inline: ($) => [$.${selector}],
  rules: {
    ${selector}: ($) => choice(${pair}),
    ${helper}: ($) => $.${selector},
  },
});`;

const directory = mkdtempSync(join(tmpdir(), "abl-shared-field-scalar-choice-"));
const rootPath = join(directory, "grammar.js");
const test = (description, code = before) => ({
  name: description,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "connect.js"),
});
const warning = {
  message:
    /__connect_prefix repeats adjacent identifier and string literal alternatives.*database, value.*\$\._identifier_or_string_literal_value\b/,
};
const tester = new RuleTester();

try {
  writeFileSync(rootPath, root);
  tester.run(name, sharedFieldScalarChoice, {
    valid: [
      test("already uses the retained helper", before.replaceAll(pair, `$.${helper}`)),
      test("only one matching field", before.replace(database, 'field("database", $.identifier)')),
      test("only one distinct field name", before.replace('"value"', '"database"')),
      test(
        "matches belong to separate rules",
        before
          .replace(database, "$.database")
          .replace("__connect_prefix:", `database: ($) => ${database},\n  __connect_prefix:`),
      ),
      test("choice stands alone", before.replace(database, `choice(${pair}, $.function_call)`)),
      test(
        "identifiers and strings are reversed",
        before.replace(pair, "$.string_literal, $.identifier"),
      ),
      test(
        "the alternatives are not adjacent",
        before.replace(pair, "$.identifier, $.other, $.string_literal"),
      ),
      test("the choice is exactly the pair", before.replace(", $.function_call", "")),
      test("duplicate alternatives", before.replace("$.function_call", "$.identifier")),
      test(
        "the choice contains the retained helper",
        before.replace("$.function_call", `$.${helper}`),
      ),
      test(
        "the choice contains the inline selector",
        before.replace("$.function_call", `$.${selector}`),
      ),
      test(
        "alternative is wrapped in precedence",
        before.replace(
          "$.identifier, $.string_literal",
          'prec("precedence", $.identifier), $.string_literal',
        ),
      ),
      test("spread alternative", before.replace("$.function_call", "...alternatives")),
      test("computed alternative", before.replace("$.string_literal", '$["string_literal"]')),
      test("dynamic field name", before.replace('"database"', "dynamicField")),
      test("empty field name", before.replace('"database"', '""')),
      test(
        "choice nested inside a field value",
        before.replace(database, `field("database", repeat1(choice(${pair}, $.function_call)))`),
      ),
      test("rule has an extra parameter", before.replace("($) => seq", "($, field) => seq")),
      test("async rule", before.replace("($) => seq", "async ($) => seq")),
      test(
        "field used as a precedence value",
        before.replace(database, `prec.right(${database}, $.other)`),
      ),
      test(
        "rule map has a spread",
        before.replace("__connect_prefix:", "...rules,\n  __connect_prefix:"),
      ),
      test(
        "local definition of the helper",
        before.replace("__connect_prefix:", `${helper}: ($) => $.other,\n  __connect_prefix:`),
      ),
      test(
        "duplicate owner rule",
        before.replace(
          "__connect_prefix:",
          "__connect_prefix: ($) => $.other,\n  __connect_prefix:",
        ),
      ),
      ...[
        `alias(${database}, $.other)`,
        `token(${database})`,
        `token.immediate(${database})`,
        `prec.dynamic(1, ${database})`,
        `field("outer", ${database})`,
        `custom(${database})`,
      ].map((wrapper) =>
        test(`unsafe enclosing call ${wrapper}`, before.replace(database, wrapper)),
      ),
      ...[
        "__connect_prefix:",
        database,
        `choice(${pair}, $.function_call)`,
        "$.string_literal",
      ].map((part) =>
        test(
          `disabled on ${part}`,
          before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${name}\n${part}`),
        ),
      ),
    ],
    invalid: [
      { ...test("CONNECT database and parameter choices"), errors: [warning] },
      {
        ...test(
          "pair follows other alternatives inside a static precedence scope",
          before.replace(
            database,
            `prec.right("precedence", field("database", choice($.function_call, ${pair}, $.other)))`,
          ),
        ),
        errors: [warning],
      },
    ],
  });

  for (const [description, source] of [
    ["helper has no definition", root.replace(`    ${helper}: ($) => $.${selector},\n`, "")],
    ["helper exists only in a comment", root.replace(`${helper}:`, `// ${helper}:`)],
    ["helper forwards another rule", root.replace(`=> $.${selector}`, "=> $.other")],
    ["selector has extra alternatives", root.replace(pair, `${pair}, $.number_literal`)],
    ["selector order differs", root.replace(pair, "$.string_literal, $.identifier")],
    ["selector is not inlined", root.replace(`[$.${selector}]`, "[]")],
    ["helper is the word symbol", root.replace("inline:", `word: ($) => $.${helper}, inline:`)],
    ["helper is inlined", root.replace(`[$.${selector}]`, `[$.${selector}, $.${helper}]`)],
    [
      "helper is in conflicts",
      root.replace("inline:", `conflicts: ($) => [[$.${helper}]], inline:`),
    ],
    [
      "helper definition is duplicated",
      root.replace(`${helper}:`, `"${helper}": ($) => $.other,\n    ${helper}:`),
    ],
  ]) {
    writeFileSync(rootPath, source);
    tester.run(name, sharedFieldScalarChoice, { valid: [test(description)], invalid: [] });
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
