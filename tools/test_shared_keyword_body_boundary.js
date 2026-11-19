import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { sharedKeywordBodyBoundary } from "../oxlint/index.js";

const use = "$.__sql_update_body";
const caller = `seq($._kw_update, ${use}, $._terminator)`;
const target = 'field("table", $._qualified_identifier)';
const item = "alias($.__sql_update_assignment, $.assignment)";
const more = "optional($.__sql_update_assignment_tail)";
const filter = "optional($.__aggregate_where_phrase)";
const body = `seq(${target}, $._kw_set, ${item}, ${more}, ${filter})`;
const definition = `__sql_update_body: ($) => ${body},`;
const assignment = 'seq(field("column", $._qualified_identifier), $._equals_value)';
const continuation = `seq(",", ${item}, ${more})`;
const before = `export default () => ({
  sql_update_statement: ($) => ${caller},
  ${definition}
  __sql_update_assignment: ($) => ${assignment},
  __sql_update_assignment_tail: ($) => ${continuation},
});`;
const suppression = "// oxlint-disable-next-line rule-to-test/shared-keyword-body-boundary";
const message = /before the sole use.*moving the shared keyword into the retained assignment body/;
const directory = mkdtempSync(join(tmpdir(), "abl-shared-keyword-body-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "sql.js"),
});

try {
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__inline_body] });",
  );
  writeFileSync(
    join(directory, "grammar", "keywords.js"),
    "export const inline = ($) => [$._kw_update, $._kw_set, $._kw_change, $._kw_with];",
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "sql.js"),
    "export default ($) => [[$.restricted_statement, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "consumer.js"),
    'export default () => ({ consumer: ($) => $["__external_body"] });',
  );

  new RuleTester().run("shared-keyword-body-boundary", sharedKeywordBodyBoundary, {
    valid: [
      fixture(
        "opener already in the assignment body",
        before
          .replace(caller, `seq(${use}, $._terminator)`)
          .replace(body, body.replace("seq(", "seq($._kw_update, ")),
      ),
      fixture("unshared opener", before.replace("$._kw_update", 'kw("UPDATE")')),
      fixture(
        "opener outside the shared inline keywords",
        before.replace("$._kw_update", "$._kw_other"),
      ),
      fixture("unshared separator", before.replace("$._kw_set", 'kw("SET")')),
      fixture("repeated opener as separator", before.replace("$._kw_set", "$._kw_update")),
      fixture("required target field absent", before.replace(target, "$._qualified_identifier")),
      fixture("optional target field", before.replace(target, `optional(${target})`)),
      fixture(
        "different assignment field type",
        before.replace(assignment, assignment.replace("$._qualified_identifier", "$.identifier")),
      ),
      fixture("unaliased assignment", before.replace(item, "$.__sql_update_assignment")),
      fixture("assignment is not an equals value", before.replace("$._equals_value", "$.value")),
      fixture(
        "different repeated assignment alias",
        before.replace(continuation, continuation.replace("$.assignment", "$.other")),
      ),
      fixture(
        "non-comma separator",
        before.replace(continuation, continuation.replace('\",\"', '\";\"')),
      ),
      fixture(
        "continuation without the same recursive tail",
        before.replace(continuation, continuation.replace(more, "optional($.__other_tail)")),
      ),
      fixture("required filter", before.replace(filter, "$.__aggregate_where_phrase")),
      fixture("aliased body use", before.replace(use, `alias(${use}, $.body)`)),
      fixture("optional body use", before.replace(use, `optional(${use})`)),
      fixture("precedence wrapper", before.replace(caller, `prec.right(${caller})`)),
      fixture(
        "private caller",
        before.replace("  sql_update_statement:", "  __sql_update_statement:"),
      ),
      fixture("different terminator", before.replace("$._terminator", "$._terminator_dot")),
      fixture("additional body use", `${before}\nconst extra = ($) => ${use};`),
      fixture("computed additional use", `${before}\nconst extra = ($) => $["__sql_update_body"];`),
      fixture("dynamic reference", `${before}\nconst extra = ($) => $[name];`),
      fixture("spread into rules", before.replace("() => ({", "() => ({ ...otherRules,")),
      fixture(
        "transitive body recursion",
        before.replace("});", `  _equals_value: ($) => ${use},\n});`),
      ),
      fixture(
        "owner recursion",
        before.replace("});", "  _equals_value: ($) => $.sql_update_statement,\n});"),
      ),
      fixture(
        "dynamic local dependency",
        before.replace("});", "  _equals_value: ($) => makeRule($),\n});"),
      ),
      fixture("inline metadata", before.replaceAll("__sql_update_body", "__inline_body")),
      fixture(
        "precedence metadata on owner",
        before.replace("  sql_update_statement:", "  restricted_statement:"),
      ),
      fixture("cross-file use", before.replaceAll("__sql_update_body", "__external_body")),
      fixture(
        "owner use in local metadata",
        `${before}\nconst meta = ($) => [$.sql_update_statement];`,
      ),
      fixture(
        "caller suppression",
        before.replace("  sql_update_statement:", `  ${suppression}\n  sql_update_statement:`),
      ),
      fixture(
        "definition suppression",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture(
        "target field suppression",
        before.replace(target, `\n    ${suppression}\n    ${target}`),
      ),
      fixture(
        "continuation suppression",
        before.replace(continuation, `\n    ${suppression}\n    ${continuation}`),
      ),
    ],
    invalid: [
      { ...fixture("SQL UPDATE opener and assignment list"), errors: [{ message }] },
      {
        ...fixture(
          "another statement with the same assignment shape",
          before
            .replaceAll("sql_update", "change")
            .replace("$._kw_update", "$._kw_change")
            .replace("$._kw_set", "$._kw_with"),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
