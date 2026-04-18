module.exports = ({ kw }) => ({
  open_query_statement: ($) => seq(kw("OPEN"), $.__open_query_body, $._terminator),

  __open_query_body: ($) =>
    seq(
      kw("QUERY"),
      field("query", $.identifier),
      $.__open_query_records,
      optional($.__open_query_tail),
    ),
  __open_query_tail: ($) =>
    choice(
      seq($.query_tuning_phrase, optional($.__open_query_tail_after_query_tuning)),
      seq(alias(kw("BREAK"), $.break), optional($.__open_query_tail_after_break)),
      seq(
        repeat1(alias($.__open_query_by_phrase, $.by_phrase)),
        optional($.__open_query_tail_after_by),
      ),
      seq(field("lock", $.__open_query_lock), optional($.__open_query_tail_after_lock)),
      $.__open_query_reposition_tail,
    ),
  __open_query_tail_after_query_tuning: ($) =>
    choice(
      seq(alias(kw("BREAK"), $.break), optional($.__open_query_tail_after_break)),
      seq(
        repeat1(alias($.__open_query_by_phrase, $.by_phrase)),
        optional($.__open_query_tail_after_by),
      ),
      seq(field("lock", $.__open_query_lock), optional($.__open_query_tail_after_lock)),
      $.__open_query_reposition_tail,
    ),
  __open_query_tail_after_break: ($) =>
    choice(
      seq(
        repeat1(alias($.__open_query_by_phrase, $.by_phrase)),
        optional($.__open_query_tail_after_by),
      ),
      seq(field("lock", $.__open_query_lock), optional($.__open_query_tail_after_lock)),
      $.__open_query_reposition_tail,
    ),
  __open_query_tail_after_by: ($) =>
    choice(
      seq(field("lock", $.__open_query_lock), optional($.__open_query_tail_after_lock)),
      $.__open_query_reposition_tail,
    ),
  __open_query_tail_after_lock: ($) => $.__open_query_reposition_tail,
  __open_query_reposition_tail: ($) =>
    choice(
      seq(
        alias(kw("INDEXED-REPOSITION"), $.indexed_reposition),
        optional(seq(kw("MAX-ROWS"), field("max_rows", $._expression))),
      ),
      seq(kw("MAX-ROWS"), field("max_rows", $._expression)),
    ),
  __open_query_records: ($) =>
    seq(
      choice(kw("FOR"), kw("PRESELECT")),
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
      seq(field("record", $._identifier_or_qualified_name), repeat($.__open_query_record_option)),
    ),
  __open_query_record_option: ($) =>
    choice(
      seq(kw("OF"), field("of", $._identifier_or_qualified_name)),
      seq(kw("WHERE"), field("where", $._expression)),
      seq(kw("USE-INDEX"), field("index", $.identifier)),
      field("lock", $.__open_query_lock),
    ),
  __open_query_lock: ($) =>
    choice(
      alias(kw("SHARE-LOCK"), $.share_lock),
      alias(kw("EXCLUSIVE-LOCK"), $.exclusive_lock),
      alias(kw("NO-LOCK"), $.no_lock),
    ),

  __open_query_by_phrase: ($) =>
    seq(
      kw("BY"),
      field("by", $._expression),
      optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
    ),
});
