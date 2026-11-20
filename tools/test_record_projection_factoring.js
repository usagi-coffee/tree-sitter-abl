import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { recordProjectionFactoring } from "../oxlint/index.js";

const name = "record-projection-factoring";
const keyword = 'kw("FIELDS", { alias: "FIELD", offset: 5 })';
const suffix = 'optional(seq($.__record_field_names_prefix, ")"))';
const fields = `seq(${keyword}, ${suffix})`;
const fieldsThenExcept = `seq(${fields}, optional($.__record_except_list))`;
const projection = `choice(${fieldsThenExcept}, $.__record_except_list)`;
const alias = "alias($.__record_field_list, $.field_list)";
const except = 'seq($._kw_except, $.__record_field_names_prefix, ")")';
const prefix = 'seq("(", optional($.__record_field_names))';
const rules = `
  record_phrase: ($) => seq($.identifier, optional($.__record_field_list_preprocessor_tail)),
  __record_field_list_preprocessor_tail: ($) =>
    choice(seq(${alias}, optional($.preprocessor_name)), $.preprocessor_name),
  __record_field_list: ($) => ${projection},
  __record_except_list: ($) => ${except},
  __record_field_names_prefix: ($) => ${prefix},
`;
const before = `export default ({ kw }) => ({${rules}});`;
const after = before
  .replace(
    projection,
    "choice($.__record_fields_list, seq(optional($.__record_fields_list), $.__record_except_list))",
  )
  .replace(
    "  __record_except_list:",
    `  __record_fields_list: ($) => ${fields},\n  __record_except_list:`,
  );
const message =
  /extracting the existing FIELDS clause.*first alternative.*before required EXCEPT.*FIELD abbreviation, optional parentheses, and enclosing field_list alias/;
const suppress = (part, rule = `rule-to-test/${name}`) =>
  before.replace(part, `\n    // oxlint-disable-next-line ${rule}\n    ${part}`);

const directory = mkdtempSync(join(tmpdir(), "abl-record-projection-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "phrases", "record.js"),
});

try {
  mkdirSync(join(directory, "grammar", "phrases"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  new RuleTester().run(name, recordProjectionFactoring, {
    valid: [
      fixture("the measured factored shape", after),
      fixture(
        "EXCEPT first",
        before.replace(projection, `choice($.__record_except_list, ${fieldsThenExcept})`),
      ),
      fixture(
        "EXCEPT before FIELDS",
        before.replace(fieldsThenExcept, `seq(optional($.__record_except_list), ${fields})`),
      ),
      fixture(
        "unfactored query-style parentheses are required",
        before.replace(suffix, 'seq($.__record_field_names_prefix, ")")'),
      ),
      fixture(
        "missing keyword abbreviation",
        before.replace(keyword, 'kw("FIELDS", { offset: 5 })'),
      ),
      fixture("different keyword abbreviation", before.replace('"FIELD"', '"FI"')),
      fixture("different keyword offset", before.replace("offset: 5", "offset: 4")),
      fixture("additional keyword options", before.replace("offset: 5", "offset: 5, name: true")),
      fixture("changed EXCEPT delimiter", before.replace(except, except.replace('")"', '"]"'))),
      fixture("changed FIELDS delimiter", before.replace(suffix, suffix.replace('")"', '"]"'))),
      fixture(
        "different prefix for FIELDS",
        before.replace(suffix, suffix.replace("_field_names_prefix", "_names")),
      ),
      fixture(
        "prefix has a required field list",
        before.replace(prefix, 'seq("(", $.__record_field_names)'),
      ),
      fixture(
        "required EXCEPT",
        before.replace("optional($.__record_except_list)", "$.__record_except_list"),
      ),
      fixture("renamed visible alias", before.replace("$.field_list", "$.projection")),
      fixture("removed alias", before.replace(alias, "$.__record_field_list")),
      fixture("alias wrapped in a field", before.replace(alias, `field("projection", ${alias})`)),
      fixture(
        "required preprocessor",
        before.replace("optional($.preprocessor_name)", "$.preprocessor_name"),
      ),
      fixture("precedence around choice", before.replace(projection, `prec.right(${projection})`)),
      fixture(
        "precedence around extracted clause",
        before.replace(fields, `prec.right(${fields})`),
      ),
      fixture(
        "computed projection reference",
        before.replace(alias, 'alias($["__record_field_list"], $.field_list)'),
      ),
      fixture(
        "computed rule key",
        before.replace("__record_field_list:", '["__record_field_list"]:'),
      ),
      fixture("spread rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture(
        "existing FIELDS helper",
        before.replace("\n});", "\n  __record_fields_list: ($) => $.other,\n});"),
      ),
      fixture(
        "second projection use",
        before.replace("\n});", "\n  other: ($) => $.__record_field_list,\n});"),
      ),
      ...["inline", "conflicts", "supertypes", "externals", "extras", "precedences", "word"].map(
        (key) =>
          fixture(
            `local ${key} metadata`,
            `export default grammar({ ${key}: ($) => [$.__record_field_list], rules: {${rules}} });`,
          ),
      ),
      ...["__record_field_list:", fields, except, alias].map((part) =>
        fixture(`targeted suppression at ${part}`, suppress(part)),
      ),
    ],
    invalid: [
      { ...fixture("the original record projection"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress(fields, "rule-to-test/shared-sequence")),
        errors: [{ message }],
      },
    ],
  });

  const rootGrammar = join(directory, "grammar.js");
  writeFileSync(rootGrammar, "export default grammar({ inline: ($) => [$.__record_field_list] });");
  new RuleTester().run(`${name} external inline metadata`, recordProjectionFactoring, {
    valid: [fixture("projection is inline")],
    invalid: [],
  });
  writeFileSync(rootGrammar, "export default grammar({ rules: {} });");

  const precedence = join(directory, "grammar", "precedences", "records.js");
  writeFileSync(precedence, "export default ($) => [[$.__record_except_list, $.other]];");
  new RuleTester().run(`${name} external precedence`, recordProjectionFactoring, {
    valid: [fixture("EXCEPT participates in precedence")],
    invalid: [],
  });
  rmSync(precedence);

  writeFileSync(
    join(directory, "grammar", "phrases", "other.js"),
    "export default () => ({ __record_fields_list: ($) => $.other });",
  );
  new RuleTester().run(`${name} external FIELDS helper`, recordProjectionFactoring, {
    valid: [fixture("FIELDS helper name is already defined")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
