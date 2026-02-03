module.exports = ({ kw }) => ({
  for_statement: ($) =>
    seq(
      optional(seq(field("label", $.identifier), ":")),
      $.__for_body,
      kw("END"),
      $._terminator,
    ),

  __for_body: ($) =>
    seq(
      kw("FOR"),
      choice($.__for_records, $.__for_variables),
      optional(alias($.__for_while_phrase, $.while_phrase)),
      optional(kw("TRANSACTION")),
      optional($.stop_after_phrase),
      repeat(
        choice(
          $.on_endkey_phrase,
          $.on_stop_phrase,
          $.on_error_phrase,
          $.on_quit_phrase,
        ),
      ),
      optional($.frame_phrase),
      $.body,
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
  __for_record_name: ($) => $._identifier_or_qualified_name,
  __for_no_lock: ($) => kw("NO-LOCK"),
  __for_exclusive_lock: ($) => kw("EXCLUSIVE-LOCK"),
  __for_share_lock: ($) => kw("SHARE-LOCK"),
  __for_no_prefetch: ($) => kw("NO-PREFETCH"),
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
      kw("TABLE-SCAN"),
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

  __for_index_name: ($) => $._identifier_or_qualified_name,
  __for_with_stream_io_phrase: ($) => seq(kw("WITH"), kw("STREAM-IO")),
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
