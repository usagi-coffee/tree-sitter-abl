import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseSequence } from "../oxlint/index.js";

const use = "$.__underline_body";
const prefix = "$.__underline_prefix";
const fields = "$.__underline_fields";
const body = `seq(${fields}, optional($.frame_phrase))`;
const statementBody = `seq(${prefix}, ${use})`;
const definition = `__underline_body: ($) => ${body},`;
const prefixDefinition =
  '__underline_prefix: ($) => seq(kw("UNDERLINE"), optional($._stream_phrase)),';
const list = `prec.right(seq(field("field", $._expression), optional(${fields})))`;
const listDefinition = `__underline_fields: ($) => ${list},`;
const before = `export default ({ kw }) => ({
  underline_statement: ($) => seq($.__underline_statement_body, $._terminator),
  __underline_statement_body: ($) => ${statementBody},
  ${prefixDefinition}
  ${definition}
  ${listDefinition}
});`;
const suppression = "// oxlint-disable-next-line rule-to-test/single-use-sequence";
const message = /sole unaliased tail.*inlining its required field list and optional phrase/;
const directory = mkdtempSync(join(tmpdir(), "abl-required-list-body-tail-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "underline.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    `export default grammar({
      inline: ($) => [$.__inline_body],
      conflicts: ($) => [[$.__underline_prefix], [$.__conflict_statement_body]],
    });`,
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "underline.js"),
    "export default ($) => [[$.__underline_fields, $.other], [$.__precedence_body, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "external.js"),
    "export default () => ({ caller: ($) => $.__external_body });",
  );

  new RuleTester().run("single-use-sequence", singleUseSequence, {
    valid: [
      fixture(
        "inlined UNDERLINE body",
        before.replace(use, `${fields}, optional($.frame_phrase)`).replace(definition, ""),
      ),
      fixture("public caller", before.replaceAll("__underline_statement_body", "statement_body")),
      fixture(
        "different private caller",
        before.replaceAll("__underline_statement_body", "__other_body"),
      ),
      fixture("missing prefix definition", before.replace(prefixDefinition, "")),
      fixture("optional prefix", before.replace(statementBody, `seq(optional(${prefix}), ${use})`)),
      fixture("wrapped caller", before.replace(statementBody, `prec.right(${statementBody})`)),
      fixture("nonfinal use", before.replace(statementBody, `seq(${prefix}, ${use}, $.other)`)),
      fixture("aliased use", before.replace(use, `alias(${use}, $.visible)`)),
      fixture("field-wrapped use", before.replace(use, `field("tail", ${use})`)),
      fixture("optional use", before.replace(use, `optional(${use})`)),
      fixture("second use", before.replace(use, `${use}, ${use}`)),
      fixture("computed second use", `${before}\nconst use = ($) => $["__underline_body"];`),
      fixture("dynamic reference", `${before}\nconst use = ($) => $[name];`),
      fixture("missing list definition", before.replace(listDefinition, "")),
      fixture("nonrecursive list", before.replace(`optional(${fields})`, "optional($.other)")),
      fixture(
        "non-field list item",
        before.replace('field("field", $._expression)', "$._expression"),
      ),
      fixture(
        "indirect recursion through list",
        before.replace("$._expression", "$.__underline_statement_body"),
      ),
      fixture(
        "indirect recursion through prefix",
        before.replace("$._stream_phrase", "$.__underline_statement_body"),
      ),
      fixture(
        "required public phrase",
        before.replace("optional($.frame_phrase)", "$.frame_phrase"),
      ),
      fixture("hidden phrase", before.replace("$.frame_phrase", "$._frame_phrase")),
      fixture("root inline metadata", before.replaceAll("__underline_body", "__inline_body")),
      fixture(
        "root conflict metadata",
        before.replaceAll("__underline_statement_body", "__conflict_statement_body"),
      ),
      fixture(
        "project precedence metadata",
        before.replaceAll("__underline_body", "__precedence_body"),
      ),
      fixture("external grammar caller", before.replaceAll("__underline_body", "__external_body")),
      fixture(
        "suppressed definition",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture("suppressed use", before.replace(use, `\n    ${suppression}\n    ${use}\n  `)),
    ],
    invalid: [{ ...fixture("UNDERLINE list followed by optional phrase"), errors: [{ message }] }],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
