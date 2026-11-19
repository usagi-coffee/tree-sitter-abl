import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseSequence } from "../oxlint/index.js";

const use = "$.__assign_input_body";
const marker = "$._kw_input";
const selector = "$._frame_browse_selector";
const group = "$.__assign_input_fields";
const tail = "$.__assign_input_sections";
const body = `seq(optional(${marker}), ${selector}, ${group}, optional(${tail}))`;
const continuation = `seq(${marker}, ${selector}, ${group}, optional(${tail}))`;
const choice = `choice(alias($.__assign_statement_phrase_body, $.assign_phrase), $.__assign_record_body, ${use})`;
const prefix = `seq($._kw_assign, optional(${choice}))`;
const definition = `__assign_input_body: ($) => ${body},`;
const fields =
  '__assign_input_fields: ($) => seq(field("field", $.identifier), optional($.__assign_input_fields)),';
const before = `export default grammar({ rules: {
  __assign_prefix: ($) => ${prefix},
  ${definition}
  __assign_input_sections: ($) => prec.right(${continuation}),
  ${fields}
} });`;
const suppression = "// oxlint-disable-next-line rule-to-test/single-use-sequence";
const message =
  /one unaliased choice-arm use.*inlining the optional marker, shared selector, field group and recursive continuation inside the existing optional choice/;
const directory = mkdtempSync(join(tmpdir(), "abl-optional-selector-choice-arm-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "assign.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    `export default grammar({
      inline: ($) => [$.__inline_body],
      conflicts: ($) => [[$.__conflict_prefix]],
    });`,
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "assign.js"),
    "export default ($) => [[$.__precedence_prefix, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "external.js"),
    "export default () => ({ caller: ($) => $.__external_body });",
  );

  new RuleTester().run("single-use-sequence", singleUseSequence, {
    valid: [
      fixture("inlined ASSIGN branch", before.replace(use, body).replace(definition, "")),
      fixture("main body without choice", before.replace(choice, use)),
      fixture("required choice", before.replace(`optional(${choice})`, choice)),
      fixture(
        "extra prefix element",
        before.replace(prefix, `seq($._kw_assign, optional(${choice}), $.end)`),
      ),
      fixture("non-keyword prefix", before.replace("$._kw_assign", "$.marker")),
      fixture("dynamic keyword", before.replaceAll(marker, "kw(inputKeyword)")),
      fixture(
        "required first marker",
        before.replace(body, body.replace(`optional(${marker})`, marker)),
      ),
      fixture("private selector", before.replaceAll(selector, "$.__local_selector")),
      fixture("public selector", before.replaceAll(selector, "$.visible_selector")),
      fixture("non-selector shared rule", before.replaceAll(selector, "$._other")),
      fixture("absent private field group", before.replace(fields, "")),
      fixture(
        "public field group",
        before.replaceAll("__assign_input_fields", "assign_input_fields"),
      ),
      fixture(
        "absent private continuation",
        before.replace(`__assign_input_sections: ($) => prec.right(${continuation}),`, ""),
      ),
      fixture(
        "required continuation",
        before.replace(body, body.replace(`optional(${tail})`, tail)),
      ),
      fixture(
        "different continuation keyword",
        before.replace(continuation, continuation.replace(marker, "$._kw_output")),
      ),
      fixture(
        "different continuation selector",
        before.replace(continuation, continuation.replace(selector, "$._other_selector")),
      ),
      fixture(
        "nonrecursive continuation",
        before.replace(continuation, `seq(${marker}, ${selector}, ${group}, optional($.end))`),
      ),
      fixture("aliased branch", before.replace(use, `alias(${use}, $.visible)`)),
      fixture("field-wrapped branch", before.replace(use, `field("selector", ${use})`)),
      fixture("precedence-wrapped branch", before.replace(use, `prec.right(${use})`)),
      fixture("public caller", before.replaceAll("__assign_prefix", "assign_prefix")),
      fixture("repeated use", before.replace(use, `${use}, ${use}`)),
      fixture("computed direct use", before.replace(use, '$["__assign_input_body"]')),
      fixture("computed second use", `${before}\nconst use = ($) => $["__assign_input_body"];`),
      fixture("dynamic reference", `${before}\nconst use = ($) => $[name];`),
      fixture("spread into rule map", before.replace("rules: {", "rules: { ...otherRules,")),
      fixture("recursion by way of field group", before.replace("$.identifier", use)),
      fixture(
        "recursion by way of retained prefix",
        before.replace("$.identifier", "$.__assign_prefix"),
      ),
      fixture(
        "dynamic field group",
        before.replace('field("field", $.identifier)', "buildField($)"),
      ),
      fixture("root inline metadata", before.replaceAll("__assign_input_body", "__inline_body")),
      fixture("root conflict metadata", before.replaceAll("__assign_prefix", "__conflict_prefix")),
      fixture(
        "separate precedence metadata",
        before.replaceAll("__assign_prefix", "__precedence_prefix"),
      ),
      fixture(
        "external grammar caller",
        before.replaceAll("__assign_input_body", "__external_body"),
      ),
      fixture(
        "metadata in current file",
        before.replace("rules:", "supertypes: ($) => [$.__assign_prefix], rules:"),
      ),
      fixture(
        "suppressed definition",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture("suppressed choice arm", before.replace(use, `\n    ${suppression}\n    ${use}\n  `)),
      fixture(
        "suppressed marker",
        before.replace(
          body,
          body.replace(`optional(${marker})`, `\n    ${suppression}\n    optional(${marker})`),
        ),
      ),
    ],
    invalid: [
      { ...fixture("optional ASSIGN selector choice arm"), errors: [{ message }] },
      {
        ...fixture(
          "literal keyword variant",
          before.replaceAll(marker, 'kw("INPUT", { offset: 3 })'),
        ),
        errors: [{ message }],
      },
    ],
  });

  symlinkSync(
    join(directory, "missing.js"),
    join(directory, "grammar", "statements", "unreadable.js"),
  );
  new RuleTester().run("single-use-sequence", singleUseSequence, {
    valid: [fixture("unreadable project file")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
