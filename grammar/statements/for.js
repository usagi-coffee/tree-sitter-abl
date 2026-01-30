module.exports = ({ kw, tkw }) => ({
  for_each_statement: ($) =>
    prec(
      1,
      seq(
        optional(seq(field("label", $.identifier), ":")),
        kw("FOR"),
        $.__for_body,
        $._terminator,
      ),
    ),

  __for_body: ($) =>
    seq(
      choice($.__for_records, $.__for_variables),
      optional(alias($.__for_while_phrase, $.while_phrase)),
      optional(tkw("TRANSACTION")),
      optional($.stop_after_phrase),
      // FIXME: this shouldn't be repeat but we need to save on state counts
      repeat(
        choice(
          $.on_error_phrase,
          $.on_endkey_phrase,
          $.on_quit_phrase,
          $.on_stop_phrase,
          $.frame_phrase,
          alias($.__for_with_stream_io_phrase, $.with_stream_io_phrase),
        ),
      ),
      $.body,
      tkw("END"),
    ),

  __for_records: ($) =>
    seq(
      alias($.__for_record, $.record),
      repeat(seq(",", alias($.__for_record, $.record))),
    ),

  __for_record: ($) =>
    seq(
      optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
      field("table", $.__for_record_name),
      optional(alias($.__for_of_phrase, $.of_phrase)),
      repeat($._for_record_option_or_where),
    ),

  _for_record_option: ($) =>
    choice(
      alias($.__for_no_lock, $.no_lock),
      alias($.__for_exclusive_lock, $.exclusive_lock),
      alias($.__for_share_lock, $.share_lock),
      alias($.__for_no_prefetch, $.no_prefetch),
      alias($.__for_by_phrase, $.by_phrase),
      alias($.__for_collate_phrase, $.collate_phrase),
      alias($.__for_use_index, $.use_index),
      alias($.__for_break_by, $.break_by),
    ),

  __for_variables: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),

  _for_record_option_or_where: ($) =>
    choice($._for_record_option, alias($.__for_where_phrase, $.where_phrase)),

  __for_where_phrase: ($) => seq(kw("WHERE"), $._expression),
  __for_of_phrase: ($) => seq(kw("OF"), $.__for_record_name),
  __for_record_name: ($) => choice($.identifier, $.qualified_name),
  __for_no_lock: ($) => tkw("NO-LOCK"),
  __for_exclusive_lock: ($) => tkw("EXCLUSIVE-LOCK"),
  __for_share_lock: ($) => tkw("SHARE-LOCK"),
  __for_no_prefetch: ($) => tkw("NO-PREFETCH"),
  __for_by_phrase: ($) =>
    prec.right(
      seq(
        kw("BY"),
        $._expression,
        optional($.__for_sort_direction),
        repeat(seq(kw("BY"), $._expression, optional($.__for_sort_direction))),
      ),
    ),

  __for_use_index: ($) =>
    choice(
      seq(kw("USE-INDEX"), field("index", $.__for_index_name)),
      tkw("TABLE-SCAN"),
    ),

  __for_break_by: ($) =>
    prec.right(
      seq(
        kw("BREAK"),
        kw("BY"),
        $._expression,
        optional($.__for_sort_direction),
        repeat(seq(kw("BY"), $._expression, optional($.__for_sort_direction))),
      ),
    ),

  __for_index_name: ($) => choice($.identifier, $.qualified_name),
  __for_with_stream_io_phrase: ($) => seq(kw("WITH"), tkw("STREAM-IO")),
  __for_sort_direction: ($) => token(/ASC(ENDING)?|DESC(ENDING)?/i),

  __for_collate_phrase: ($) =>
    seq(
      kw("COLLATE"),
      "(",
      field("string", $._expression),
      ",",
      field("strength", $._expression),
      optional(seq(",", field("collation", $._expression))),
      ")",
      optional($.__for_sort_direction),
    ),

  __for_while_phrase: ($) =>
    seq(kw("WHILE"), field("condition", $._expression)),
});
