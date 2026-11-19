import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseSequence } from "../oxlint/index.js";

const head = "$.__on_database_event_head";
const use = "$.__on_database_event_body";
const tail = "$.__on_database_event_tail";
const revert = "$.__on_revert_action";
const statement = "$._statement";
const field = 'field("object", $._qualified_identifier)';
const action = `choice(${revert}, ${statement})`;
const body = `seq(${field}, optional(${tail}), ${action})`;
const arm = `seq(${head}, ${use})`;
const caller = `seq($._kw_on, choice($.ui_event, choice(${arm}, $.widget_event)))`;
const headDefinition =
  '__on_database_event_head: ($) => seq(field("event", choice($._kw_delete, $._kw_write)), $._kw_of),';
const tailDefinition = `__on_database_event_tail: ($) => choice($._kw_override, $.referencing_phrase),`;
const revertDefinition =
  '__on_revert_action: ($) => seq(alias(kw("REVERT"), $.revert), $._terminator),';
const definition = `__on_database_event_body: ($) => ${body},`;
const before = `export default ({ kw }) => ({
  on_statement: ($) => prec.right(${caller}),
  ${headDefinition}
  ${tailDefinition}
  ${revertDefinition}
  ${definition}
});`;
const suppression = "// oxlint-disable-next-line rule-to-test/single-use-sequence";
const message =
  /unaliased choice-arm use.*object field, optional clause, and action choice.*retained private head/;
const directory = mkdtempSync(join(tmpdir(), "abl-required-choice-arm-body-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "on.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ conflicts: ($) => [[$.__conflict_body], [$.conflict_statement]] });",
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "on.js"),
    "export default ($) => [[$.__precedence_body, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "external.js"),
    "export default () => ({ caller: ($) => $.__external_body });",
  );

  new RuleTester().run("single-use-sequence", singleUseSequence, {
    valid: [
      fixture("inlined ON body", before.replace(use, body).replace(definition, "")),
      fixture("private caller", before.replace("on_statement:", "__on_statement:")),
      fixture("no right precedence wrapper", before.replace(`prec.right(${caller})`, caller)),
      fixture("required use outside choice", before.replace(caller, `seq($._kw_on, ${arm})`)),
      fixture("nonfinal use", before.replace(arm, `seq(${head}, ${use}, $.extra)`)),
      fixture("optional use", before.replace(use, `optional(${use})`)),
      fixture("alias around choice arm", before.replace(arm, `alias(${arm}, $.branch)`)),
      fixture("field around choice arm", before.replace(arm, `field("branch", ${arm})`)),
      fixture("token around choice arm", before.replace(arm, `token(${arm})`)),
      fixture("direct private use as a choice arm", before.replace(arm, use)),
      fixture("no retained local head", before.replace(headDefinition, "")),
      fixture("shared head", before.replace(arm, `seq($._shared_head, ${use})`)),
      fixture("optional head", before.replace(arm, `seq(optional(${head}), ${use})`)),
      fixture("different field", before.replace(field, 'field("label", $.identifier)')),
      fixture("no field", before.replace(field, "$._qualified_identifier")),
      fixture("no retained tail", before.replace(tailDefinition, "")),
      fixture("required clause", before.replace(`optional(${tail})`, tail)),
      fixture("no retained local action", before.replace(revertDefinition, "")),
      fixture("shared dispatcher first", before.replace(action, `choice(${statement}, ${revert})`)),
      fixture("third action", before.replace(action, `choice(${revert}, ${statement}, $.extra)`)),
      fixture("second use", before.replace(arm, `seq(${head}, ${use}, ${use})`)),
      fixture(
        "computed second use",
        `${before}\nconst use = ($) => $["__on_database_event_body"];`,
      ),
      fixture("dynamic reference", `${before}\nconst use = ($) => $[name];`),
      fixture(
        "indirect head recursion",
        before.replace(headDefinition, `__on_database_event_head: ($) => ${use},`),
      ),
      fixture(
        "indirect tail recursion",
        before.replace(tailDefinition, "__on_database_event_tail: ($) => $.on_statement,"),
      ),
      fixture(
        "root body metadata",
        before.replaceAll("__on_database_event_body", "__conflict_body"),
      ),
      fixture("root caller metadata", before.replaceAll("on_statement", "conflict_statement")),
      fixture(
        "project precedence metadata",
        before.replaceAll("__on_database_event_body", "__precedence_body"),
      ),
      fixture(
        "external grammar caller",
        before.replaceAll("__on_database_event_body", "__external_body"),
      ),
      fixture(
        "suppressed definition",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture("suppressed use", before.replace(use, `\n    ${suppression}\n    ${use}\n  `)),
    ],
    invalid: [
      { ...fixture("ON database event body under nested choice"), errors: [{ message }] },
      {
        ...fixture(
          "same body as a direct choice-arm suffix",
          before.replace(
            `choice($.ui_event, choice(${arm}, $.widget_event))`,
            `choice(${arm}, $.widget_event)`,
          ),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
