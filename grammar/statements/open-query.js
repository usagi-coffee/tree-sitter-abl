export default ({ kw }) => ({
  open_query_statement: ($) => seq($.__open_query_prefix, $._terminator),

  __open_query_prefix: ($) =>
    seq(
      kw("OPEN"),
      kw("QUERY"),
      field("query", $.identifier),
      $.__open_query_records,
      optional($.query_tuning_phrase),
      optional($.__open_query_tail_after_tuning),
    ),
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
      repeat(seq(",", $.__open_query_join_record)),
    ),
  __open_query_join_record: ($) =>
    seq(
      choice(kw("EACH"), kw("FIRST"), kw("LAST")),
      alias($.__open_query_record_phrase, $.record_phrase),
    ),

  __open_query_record_phrase: ($) =>
    prec.right(
      seq(
        field("record", $._identifier_or_qualified_name),
        repeat(
          choice(
            seq($._of_keyword, field("of", $._identifier_or_qualified_name)),
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
