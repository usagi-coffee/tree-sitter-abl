module.exports = ({ kw }) => ({
  repeat_statement: ($) =>
    seq(
      optional(seq(field("label", $.identifier), ":")),
      kw("REPEAT"),
      $.__repeat_body,
      $._terminator,
    ),

  __repeat_body: ($) =>
    seq(
      optional(seq(kw("FOR"), $.__repeat_records)),
      optional($.__repeat_preselect_phrase),
      optional($.__repeat_query_tuning_phrase),
      optional($.__repeat_loop_phrase),
      optional(choice($.__repeat_while_phrase, $.__repeat_until_phrase)),
      optional(kw("TRANSACTION")),
      optional($.stop_after_phrase),
      // FIXME: this shouldn't be repeat but we need to save on state counts
      repeat(
        choice(
          $.on_endkey_phrase,
          $.on_stop_phrase,
          $.on_error_phrase,
          $.on_quit_phrase,
          $.frame_phrase,
        ),
      ),
      $.body,
      kw("END"),
    ),

  __repeat_records: ($) =>
    seq(
      field("record", $.__repeat_record),
      repeat(seq(",", field("record", $.__repeat_record))),
    ),
  __repeat_record: ($) => choice($.identifier, $.qualified_name),
  __repeat_preselect_phrase: ($) =>
    seq(
      kw("PRESELECT"),
      $.preselect_record_list,
      optional($.__repeat_break_by_phrase),
    ),
  __repeat_break_by_phrase: ($) =>
    prec.right(
      seq(
        optional(kw("BREAK")),
        kw("BY"),
        $._expression,
        optional($.__repeat_sort_direction),
        repeat(
          seq(kw("BY"), $._expression, optional($.__repeat_sort_direction)),
        ),
      ),
    ),
  __repeat_query_tuning_phrase: ($) =>
    seq(
      kw("QUERY-TUNING"),
      "(",
      repeat1(
        choice(
          kw("BIND-WHERE"),
          kw("NO-BIND-WHERE"),
          seq(kw("CACHE-SIZE"), $._expression),
          seq(kw("DEBUG"), choice(kw("SQL"), kw("EXTENDED"))),
          kw("NO-DEBUG"),
          kw("INDEX-HINT"),
          kw("NO-INDEX-HINT"),
          kw("JOIN-BY-SQLDB"),
          kw("NO-JOIN-BY-SQLDB"),
          kw("LOOKAHEAD"),
          kw("NO-LOOKAHEAD"),
          kw("SEPARATE-CONNECTION"),
          kw("NO-SEPARATE-CONNECTION"),
        ),
      ),
      ")",
    ),
  __repeat_loop_phrase: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),
  __repeat_while_phrase: ($) =>
    seq(kw("WHILE"), field("condition", $._expression)),
  __repeat_until_phrase: ($) =>
    seq(kw("UNTIL"), field("condition", $._expression)),
  __repeat_sort_direction: ($) => token(/ASC(ENDING)?|DESC(ENDING)?/i),
  __repeat_undo_phrase: ($) =>
    seq(
      kw("UNDO"),
      ",",
      choice(
        seq(kw("RETURN"), kw("ERROR"), $.string_literal),
        kw("THROW"),
        kw("LEAVE"),
        kw("NEXT"),
        kw("RETRY"),
        seq(kw("RETURN"), kw("NO-APPLY")),
        seq(kw("RETURN"), $.string_literal),
      ),
    ),
  __repeat_undo_throw_phrase: ($) => seq(kw("UNDO"), ",", kw("THROW")),
  __repeat_undo_return_error: ($) =>
    seq(kw("UNDO"), ",", kw("RETURN"), kw("ERROR"), $.new_expression),
});
