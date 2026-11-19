import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { recordTargetExtraction } from "../oxlint/index.js";

const selector = `optional(choice(
    alias($._kw_first, $.first), alias($._kw_last, $.last), alias($._kw_next, $.next),
    alias($._kw_prev, $.prev), alias($._kw_current, $.current)
  ))`;
const table = 'field("table", $._qualified_identifier)';
const constant = 'optional(field("constant", $._expression))';
const target = `${table}, ${constant}`;
const options = `seq(
    choice($.of_phrase, $._find_record_option, alias($.__find_where_phrase, $.where_phrase)),
    optional($.__find_options)
  )`;
const prefix = `seq(
    $._kw_find,
    ${selector},
    ${target},
    optional($.__find_options)
  )`;
const statement = "seq($.__find_prefix, $._terminator)";
const rules = `
  find_statement: ($) => ${statement},
  __find_prefix: ($) => ${prefix},
  __find_options: ($) => prec.right(${options}),
`;
const before = `export default ({ kw }) => ({${rules}});`;
const extracted = before
  .replace(target, "$.__find_target")
  .replace("\n});", `\n  __find_target: ($) => seq(${target}),\n});`);
const name = "record-target-extraction";
const suppress = (part, rule = `rule-to-test/${name}`) =>
  before.replace(part, `\n  // oxlint-disable-next-line ${rule}\n  ${part}`);
const message =
  /extracting the table field and optional constant expression into one private target rule.*selector aliases, recursive options, enclosing precedence and terminator/;
const directory = mkdtempSync(join(tmpdir(), "abl-record-target-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "find.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__inline_prefix] });",
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "statements.js"),
    "export default ($) => [[$.__precedence_prefix, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "alternate.js"),
    "export default () => ({ alternate: ($) => $.__external_prefix });",
  );

  new RuleTester().run(name, recordTargetExtraction, {
    valid: [
      fixture("already extracted target", extracted),
      fixture("identifier before selector", before.replace("$._kw_find", "$.identifier")),
      fixture("dynamic selector reference", before.replace("$._kw_find", "$[keyword]")),
      fixture(
        "unaliased selector alternative",
        before.replace("alias($._kw_first, $.first)", "$._kw_first"),
      ),
      fixture(
        "required selector",
        before.replace(selector, selector.slice("optional(".length, -1)),
      ),
      fixture(
        "value without required table field",
        before.replace(table, "$._qualified_identifier"),
      ),
      fixture("optional table field", before.replace(table, `optional(${table})`)),
      fixture("computed table field name", before.replace('"table"', "tableName")),
      fixture("constant is not an expression", before.replace("$._expression", "$.number_literal")),
      fixture(
        "constant field is required",
        before.replace(constant, constant.slice("optional(".length, -1)),
      ),
      fixture(
        "constant follows options",
        before.replace(
          `${target},\n    optional($.__find_options)`,
          `${table}, optional($.__find_options), ${constant}`,
        ),
      ),
      fixture(
        "options are mandatory",
        before.replace("    optional($.__find_options)", "    $.__find_options"),
      ),
      fixture(
        "options are not right associative",
        before.replace(`prec.right(${options})`, options),
      ),
      fixture(
        "options have no recursive continuation",
        before.replace("optional($.__find_options)\n  )", "optional($.__another)\n  )"),
      ),
      fixture(
        "wrapped options use",
        before.replace(
          "    optional($.__find_options)",
          "    optional(alias($.__find_options, $.options))",
        ),
      ),
      fixture(
        "aliased prefix",
        before.replace(statement, "seq(alias($.__find_prefix, $.body), $._terminator)"),
      ),
      fixture("different terminator", before.replace("$._terminator", "$._no_error_terminator")),
      fixture("precedence around prefix body", before.replace(prefix, `prec.right(${prefix})`)),
      fixture(
        "dynamic precedence around prefix body",
        before.replace(prefix, `prec.dynamic(1, ${prefix})`),
      ),
      fixture(
        "duplicate prefix in the rule map",
        before.replace("__find_prefix:", "__find_prefix: ($) => $.other,\n  __find_prefix:"),
      ),
      fixture("computed rule keys", before.replace("__find_prefix:", '["__find_prefix"]:')),
      fixture("spread into rules", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("inline metadata", before.replaceAll("__find_prefix", "__inline_prefix")),
      fixture(
        "project precedence metadata",
        before.replaceAll("__find_prefix", "__precedence_prefix"),
      ),
      fixture("external prefix use", before.replaceAll("__find_prefix", "__external_prefix")),
      fixture(
        "additional local prefix use",
        before.replace("find_statement:", "more: ($) => $.__find_prefix,\n  find_statement:"),
      ),
      fixture(
        "computed prefix use in metadata",
        `${before}\nexport const inline = ($) => [$["__find_prefix"]];`,
      ),
      ...["find_statement:", "__find_prefix:", table, constant, "__find_options:"].map((part) =>
        fixture(`targeted suppression at ${part}`, suppress(part)),
      ),
    ],
    invalid: [
      { ...fixture("FIND target before recursive options"), errors: [{ message }] },
      {
        ...fixture(
          "unrelated nullable-tail suppression",
          suppress(prefix, "tree-sitter-optimize/non-empty-tail-extraction"),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
