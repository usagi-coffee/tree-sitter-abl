import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { openQueryIndexedRepositionBranch } from "../oxlint/index.js";

const ruleId = "open-query-indexed-reposition-branch";
const indexedBranch =
  'seq(alias(kw("INDEXED-REPOSITION"), $.indexed_reposition), optional($.__open_query_max_rows_option))';
const lockBranch = 'seq(field("lock", $._lock_option), optional($.__open_query_reposition_tail))';
const oldTail = `__open_query_tail_after_by: ($) => choice(${lockBranch}, $.__open_query_reposition_tail),
  __open_query_reposition_tail: ($) => choice(${indexedBranch}, $.__open_query_max_rows_option),`;
const newTail = `__open_query_tail_after_by: ($) => choice(
    seq(field("lock", $._lock_option), optional(choice(
      $.__open_query_indexed_reposition, $.__open_query_max_rows_option,
    ))),
    $.__open_query_indexed_reposition, $.__open_query_max_rows_option,
  ),
  __open_query_indexed_reposition: ($) => ${indexedBranch},`;
const before = `export default ({ kw }) => ({
  open_query_statement: ($) => seq($.__open_query_prefix, $._terminator),
  __open_query_prefix: ($) => seq(
    $._kw_open, $._kw_query, field("query", $.identifier), choice($._kw_for, kw("PRESELECT")),
    $._kw_each, $.__open_query_record_tail, optional($.query_tuning_phrase),
    optional($.__open_query_tail_after_tuning),
  ),
  __open_query_tail_after_tuning: ($) => choice(
    seq(alias($._kw_break, $.break), optional($.__open_query_tail_after_break)),
    $.__open_query_tail_after_break,
  ),
  __open_query_tail_after_break: ($) => choice(
    seq($.__open_query_by_phrases, optional($.__open_query_tail_after_by)),
    $.__open_query_tail_after_by,
  ),
  ${oldTail}
  __open_query_max_rows_option: ($) => seq(kw("MAX-ROWS"), field("max_rows", $._expression)),
  __open_query_record_tail: ($) => seq(
    alias($.__open_query_record_phrase, $.record_phrase), optional($.__open_query_join_records),
  ),
  __open_query_join_records: ($) => prec.right(seq(
    ",", choice($._kw_each, $._kw_first, $._kw_last), $.__open_query_record_tail,
  )),
  __open_query_record_phrase: ($) => field("record", $._qualified_identifier),
  __open_query_by_phrase: ($) => seq(
    $._kw_by, field("by", $._expression), optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
  ),
  __open_query_by_phrases: ($) => prec.right(seq(
    alias($.__open_query_by_phrase, $.by_phrase), optional($.__open_query_by_phrases),
  )),
});`;
const append = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (rule) =>
  before.replace(
    "__open_query_reposition_tail: ($)",
    `// oxlint-disable-next-line ${rule}\n  __open_query_reposition_tail: ($)`,
  );
const message = /extracting the INDEXED-REPOSITION sequence.*folding the old dispatcher/;
const coreDispatch =
  "export default () => ({ _statement: ($) => choice($.input_through_statement, $.open_query_statement, $.preselect_statement) });";

const directory = mkdtempSync(join(tmpdir(), "abl-open-query-indexed-reposition-"));
const root = join(directory, "grammar.js");
const statements = join(directory, "grammar", "statements");
const core = join(directory, "grammar", "core", "statements.js");
const other = join(statements, "other.js");
const precedence = join(directory, "grammar", "precedences", "open-query.js");
const fixture = (name, code = before, file = "open-query.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(statements, file),
});
const test = (name, valid, invalid = []) =>
  new RuleTester().run(name, openQueryIndexedRepositionBranch, { valid, invalid });

try {
  mkdirSync(statements, { recursive: true });
  mkdirSync(join(directory, "grammar", "core"));
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(core, coreDispatch);
  test(
    ruleId,
    [
      fixture("measured proposal already applied", before.replace(oldTail, newTail)),
      fixture("shape in another grammar file", before, "other.js"),
      fixture("changed indexed alias", before.replace("$.indexed_reposition", "$.positioned")),
      fixture(
        "no independent MAX-ROWS",
        before.replace(`choice(${indexedBranch}, $.__open_query_max_rows_option)`, indexedBranch),
      ),
      fixture(
        "reordered reposition alternatives",
        before.replace(
          `choice(${indexedBranch}, $.__open_query_max_rows_option)`,
          `choice($.__open_query_max_rows_option, ${indexedBranch})`,
        ),
      ),
      fixture("other MAX-ROWS value field", before.replace('field("max_rows"', 'field("limit"')),
      fixture(
        "moved lock",
        before.replace(
          lockBranch,
          'seq(optional($.__open_query_reposition_tail), field("lock", $._lock_option))',
        ),
      ),
      fixture(
        "required reposition after lock",
        before.replace(
          "optional($.__open_query_reposition_tail)",
          "$.__open_query_reposition_tail",
        ),
      ),
      fixture(
        "changed tuning order",
        before.replace(
          "optional($.query_tuning_phrase),\n    optional($.__open_query_tail_after_tuning)",
          "optional($.__open_query_tail_after_tuning),\n    optional($.query_tuning_phrase)",
        ),
      ),
      fixture("changed BREAK alias", before.replace("$.break)", "$.query_break)")),
      fixture(
        "different BY recursion",
        before.replace(
          "prec.right(seq(\n    alias($.__open_query_by_phrase",
          "prec.left(seq(\n    alias($.__open_query_by_phrase",
        ),
      ),
      fixture(
        "different descending abbreviation",
        before.replace("{ offset: 4 }", "{ offset: 3 }"),
      ),
      fixture("dispatcher is suppressed", suppress("rule-to-test/" + ruleId)),
      fixture(
        "extra local old dispatch use",
        append("extra: ($) => $.__open_query_reposition_tail"),
      ),
      fixture(
        "new helper is already declared",
        append("__open_query_indexed_reposition: ($) => $.other"),
      ),
      fixture("locally declared index alias", append("indexed_reposition: ($) => $.other")),
      fixture("locally declared shared lock", append("_lock_option: ($) => $.other")),
      fixture("extra local keyword use", append('extra: ($) => kw("max-rows")')),
      fixture("computed rule key", append('["other"]: ($) => $.other')),
    ],
    [
      { ...fixture("original locked and unlocked alternatives"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress("rule-to-test/shared-sequence")),
        errors: [{ message }],
      },
    ],
  );

  const collisions = [
    [
      "new helper declared externally",
      other,
      'export default { "__open_query_indexed_reposition": ($) => $.other };',
    ],
    [
      "external dispatcher reference",
      other,
      'export default ($) => $["__open_query_reposition_tail"];',
    ],
    ["extra public statement use", other, "export default ($) => $.open_query_statement;"],
    [
      "external alias ownership",
      other,
      'export default { indexed_reposition: ($) => kw("OTHER") };',
    ],
    ["external indexed keyword use", other, 'export default ({ kw }) => kw("indexed-reposition");'],
    [
      "root conflict includes the dispatcher",
      root,
      "export default grammar({ conflicts: ($) => [[$.__open_query_reposition_tail, $.other]] });",
    ],
    [
      "computed root inline reference",
      root,
      'export default grammar({ inline: ($) => [$["__open_query_tail_after_by"]] });',
    ],
    [
      "new helper in project precedence",
      precedence,
      "export default ($) => [[$.__open_query_indexed_reposition, $.other]];",
    ],
  ];
  for (const [name, file, source] of collisions) {
    writeFileSync(file, source);
    test(ruleId + " " + name, [fixture(name)]);
    rmSync(file);
  }
  writeFileSync(core, coreDispatch.replace("$.input_through_statement, ", ""));
  test(ruleId + " changed dispatch", [fixture("changed neighboring dispatch")]);
  writeFileSync(core, coreDispatch + '\nconst extra = ($) => $["open_query_statement"];');
  test(ruleId + " duplicate dispatch", [fixture("extra public dispatch reference")]);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
