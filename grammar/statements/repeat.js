module.exports = ({ kw, tkw }) => ({
  repeat_statement: ($) =>
    seq(
      optional(seq(field("label", $.identifier), ":")),
      tkw("REPEAT"),
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
      optional(tkw("TRANSACTION")),
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
      tkw("END"),
    ),

  __repeat_records: ($) =>
    seq(field("record", $.__repeat_record), repeat(seq(",", field("record", $.__repeat_record)))),
  __repeat_record: ($) => choice($.identifier, $.qualified_name),
  __repeat_preselect_phrase: ($) =>
    seq(kw("PRESELECT"), $.preselect_record_list, optional($.__repeat_break_by_phrase)),
  __repeat_break_by_phrase: ($) =>
    prec.right(
      seq(
        optional(kw("BREAK")),
        kw("BY"),
        $._expression,
        optional($.__repeat_sort_direction),
        repeat(seq(kw("BY"), $._expression, optional($.__repeat_sort_direction))),
      ),
    ),
  __repeat_query_tuning_phrase: ($) =>
    seq(
      kw("QUERY-TUNING"),
      "(",
      repeat1(
        choice(
          tkw("BIND-WHERE"),
          tkw("NO-BIND-WHERE"),
          seq(kw("CACHE-SIZE"), $._expression),
          seq(kw("DEBUG"), choice(tkw("SQL"), tkw("EXTENDED"))),
          tkw("NO-DEBUG"),
          tkw("INDEX-HINT"),
          tkw("NO-INDEX-HINT"),
          tkw("JOIN-BY-SQLDB"),
          tkw("NO-JOIN-BY-SQLDB"),
          tkw("LOOKAHEAD"),
          tkw("NO-LOOKAHEAD"),
          tkw("SEPARATE-CONNECTION"),
          tkw("NO-SEPARATE-CONNECTION"),
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
  __repeat_while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),
  __repeat_until_phrase: ($) => seq(kw("UNTIL"), field("condition", $._expression)),
  __repeat_sort_direction: ($) => token(/ASC(ENDING)?|DESC(ENDING)?/i),
  __repeat_undo_phrase: ($) =>
    seq(
      tkw("UNDO"),
      ",",
      choice(
        seq(
          tkw("RETURN"),
          tkw("ERROR"),
          $._escaped_string,
          optional(
            token.immediate(
              /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
            ),
          ),
        ),
        tkw("THROW"),
        tkw("LEAVE"),
        tkw("NEXT"),
        tkw("RETRY"),
        seq(tkw("RETURN"), tkw("NO-APPLY")),
        seq(
          tkw("RETURN"),
          $._escaped_string,
          optional(
            token.immediate(
              /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
            ),
          ),
        ),
      ),
    ),
  __repeat_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __repeat_undo_return_error: ($) =>
    seq(tkw("UNDO"), ",", tkw("RETURN"), tkw("ERROR"), $.new_expression),
});
