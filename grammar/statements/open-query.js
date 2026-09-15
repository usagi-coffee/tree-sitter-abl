export default ({ kw }) => ({
  open_query_statement: ($) => seq($.__open_query_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  __open_query_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("OPEN"),
      kw("QUERY"),
      field("query", $.identifier),
      $.__open_query_records,
      optional($.query_tuning_phrase),
      optional($.__open_query_tail_after_tuning),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __open_query_tail_after_tuning: ($) =>
    choice(
      seq(alias(kw("BREAK"), $.break), optional($.__open_query_tail_after_break)),
      $.__open_query_tail_after_break,
    ),
  __open_query_tail_after_break: ($) =>
    choice(
      seq($.__open_query_by_phrases, optional($.__open_query_tail_after_by)),
      $.__open_query_tail_after_by,
    ),
  __open_query_tail_after_by: ($) =>
    choice(
      seq(field("lock", $._lock_option), optional($.__open_query_reposition_tail)),
      $.__open_query_reposition_tail,
    ),
  __open_query_reposition_tail: ($) =>
    choice(
      seq(
        alias(kw("INDEXED-REPOSITION"), $.indexed_reposition),
        optional($.__open_query_max_rows_option),
      ),
      $.__open_query_max_rows_option,
    ),
  __open_query_max_rows_option: ($) => seq(kw("MAX-ROWS"), field("max_rows", $._expression)),
  __open_query_records: ($) =>
    seq(
      choice($._for_keyword, kw("PRESELECT")),
      kw("EACH"),
      alias($.__open_query_record_phrase, $.record_phrase),
      optional($.__open_query_join_records),
    ),
  __open_query_join_records: ($) =>
    prec.right(seq(",", $.__open_query_join_record, optional($.__open_query_join_records))),
  __open_query_join_record: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice(kw("EACH"), kw("FIRST"), kw("LAST")),
      // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
      alias($.__open_query_record_phrase, $.record_phrase),
    ),

  __open_query_record_phrase: ($) =>
    prec.right(
      seq(
        field("record", $._identifier_or_qualified_name),
        // oxlint-disable-next-line tree-sitter-optimize/recurse
        repeat(
          choice(
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq($._of_keyword, field("of", $._identifier_or_qualified_name)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq(kw("WHERE"), field("where", $._expression)),
            seq(kw("USE-INDEX"), field("index", $.identifier)),
            field("lock", $._lock_option),
            seq(optional(alias(kw("LEFT"), $.left)), alias(kw("OUTER-JOIN"), $.outer_join)),
          ),
        ),
      ),
    ),
  __open_query_by_phrase: ($) =>
    seq(
      $._by_keyword,
      field("by", $._expression),
      optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
    ),
  __open_query_by_phrases: ($) =>
    prec.right(
      seq(alias($.__open_query_by_phrase, $.by_phrase), optional($.__open_query_by_phrases)),
    ),
});
