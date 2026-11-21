import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containsAlternatives, dslSignature, report, rule, ruleName } from "../helpers.js";
import { staticSourceTokens, usedOutsideFile } from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "open-query-indexed-reposition-branch";
const statement = "open_query_statement";
const afterBy = "__open_query_tail_after_by";
const dispatcher = "__open_query_reposition_tail";
const branch = "__open_query_indexed_reposition";
const indexedAlias = "indexed_reposition";
const keywords = ["INDEXED-REPOSITION", "MAX-ROWS"];
const dispatch = staticSourceTokens(
  "$.input_through_statement, $.open_query_statement, $.preselect_statement",
);

function matchesByPhrase(node) {
  if (
    dslSignature(node) !==
    'seq($._kw_by,field("by",$._expression),optional(field("sort_order",kw("DESCENDING",ObjectExpression))))'
  )
    return false;

  const [, , sortOrder] = node.arguments;
  const [sortField] = sortOrder.arguments;
  const [, descending] = sortField.arguments;
  const [offset, ...other] = descending.arguments[1].properties;
  return Boolean(
    offset && other.length === 0 && ruleName(offset) === "offset" && offset.value.value === 4,
  );
}

const measuredRules = new Map([
  [statement, "seq($.__open_query_prefix,$._terminator)"],
  [
    "__open_query_prefix",
    'seq($._kw_open,$._kw_query,field("query",$.identifier),choice($._kw_for,kw("PRESELECT")),$._kw_each,$.__open_query_record_tail,optional($.query_tuning_phrase),optional($.__open_query_tail_after_tuning))',
  ],
  [
    "__open_query_record_tail",
    "seq(alias($.__open_query_record_phrase,$.record_phrase),optional($.__open_query_join_records))",
  ],
  [
    "__open_query_tail_after_tuning",
    "choice(seq(alias($._kw_break,$.break),optional($.__open_query_tail_after_break)),$.__open_query_tail_after_break)",
  ],
  [
    "__open_query_tail_after_break",
    "choice(seq($.__open_query_by_phrases,optional($.__open_query_tail_after_by)),$.__open_query_tail_after_by)",
  ],
  [
    afterBy,
    'choice(seq(field("lock",$._lock_option),optional($.__open_query_reposition_tail)),$.__open_query_reposition_tail)',
  ],
  [
    dispatcher,
    'choice(seq(alias(kw("INDEXED-REPOSITION"),$.indexed_reposition),optional($.__open_query_max_rows_option)),$.__open_query_max_rows_option)',
  ],
  ["__open_query_max_rows_option", 'seq(kw("MAX-ROWS"),field("max_rows",$._expression))'],
  ["__open_query_by_phrase", matchesByPhrase],
  [
    "__open_query_by_phrases",
    "prec.right(seq(alias($.__open_query_by_phrase,$.by_phrase),optional($.__open_query_by_phrases)))",
  ],
]);
const expectedUses = new Map([
  [statement, 0],
  ["__open_query_prefix", 1],
  ["__open_query_record_tail", 2],
  ["__open_query_tail_after_tuning", 1],
  ["__open_query_tail_after_break", 2],
  [afterBy, 2],
  [dispatcher, 2],
  ["__open_query_max_rows_option", 2],
  ["__open_query_by_phrase", 1],
  ["__open_query_by_phrases", 2],
  [branch, 0],
  [indexedAlias, 1],
]);
const sharedInputs = [
  "_terminator",
  "_kw_open",
  "_kw_query",
  "_kw_for",
  "_kw_each",
  "identifier",
  "record_phrase",
  "query_tuning_phrase",
  "_kw_break",
  "break",
  "_lock_option",
  indexedAlias,
  "_expression",
  "_kw_by",
  "by_phrase",
];

function hasMeasuredDispatch(file) {
  try {
    const tokens = staticSourceTokens(readFileSync(file, "utf8"));
    return (
      containsAlternatives(tokens, dispatch) &&
      tokens.filter((token) => token === statement || token.slice(1, -1) === statement).length === 1
    );
  } catch {
    return false;
  }
}

export const openQueryIndexedRepositionBranch = rule((context) => {
  if (
    resolve(context.cwd, context.filename) !==
    resolve(context.cwd, "grammar/statements/open-query.js")
  )
    return {};

  const keywordUses = new Map(keywords.map((keyword) => [keyword, 0]));
  return {
    Literal(node) {
      if (typeof node.value !== "string") return;
      const keyword = node.value.toUpperCase();
      if (keywordUses.has(keyword)) keywordUses.set(keyword, keywordUses.get(keyword) + 1);
    },
    "Program:exit"(program) {
      const core = resolve(context.cwd, "grammar/core/statements.js");
      if (!hasMeasuredDispatch(core)) return;
      if (
        keywords.some(
          (keyword) =>
            keywordUses.get(keyword) !== 1 ||
            usedOutsideFile(context, keyword, { caseInsensitiveLiteral: true }),
        )
      )
        return;

      const local = matchStaticRuleLayout(
        context,
        program,
        measuredRules,
        expectedUses,
        new Map([[statement, [core]]]),
      );
      if (!local || sharedInputs.some((name) => local.has(name))) return;

      report(
        context,
        local.get(dispatcher),
        ruleId,
        "Try extracting the INDEXED-REPOSITION sequence into a private rule and folding the old dispatcher into the after-BY choice. Keep that private branch and MAX-ROWS alone available both after the lock and without a lock. Preserve the indexed alias, lock field and option order. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  };
}, "Suggest extracting the indexed reposition branch and folding its OPEN QUERY dispatcher");
