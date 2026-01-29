module.exports = ({ kw, tkw }) => ({
  do_block: ($) =>
    prec(
      1,
      seq(
        optional(seq(field("label", $.identifier), $._colon)),
        tkw("DO"),
        $.__do_body,
        tkw("END"),
        $._terminator,
      ),
    ),

  __do_body: ($) =>
    seq(
      optional(alias($.__do_for_phrase, $.for_phrase)),
      optional(alias($.__do_preselect_phrase, $.preselect_phrase)),
      optional(alias($.__do_query_tuning_phrase, $.query_tuning)),
      optional($.__do_transaction_phrase),
      optional(choice($.__do_while_phrase, $.__do_loop_phrase)),
      optional($.__do_transaction_phrase),
      optional(alias($.__do_stop_after_phrase, $.stop_after_phrase)),
      // FIXME: this shouldn't be repeat but we need to save on state counts
      repeat(
        choice(
          alias($.__do_on_endkey_phrase, $.on_endkey_phrase),
          alias($.__do_on_error_phrase, $.on_error_phrase),
          alias($.__do_on_quit_phrase, $.on_quit_phrase),
          alias($.__do_on_stop_phrase, $.on_stop_phrase),
        ),
      ),
      optional($.frame_phrase),
      $.body,
    ),

  body: ($) => seq(choice($._colon, $._terminator_dot), repeat($._statement)),

  __do_loop_phrase: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),
  __do_while_phrase: ($) => seq(kw("WHILE"), $._expression),
  __do_for_phrase: ($) => seq(kw("FOR"), $.__do_record_list),
  __do_record_list: ($) => seq($.__do_record, repeat(seq(",", $.__do_record))),
  __do_record: ($) => field("record", choice($.identifier, $.qualified_name)),
  __do_preselect_phrase: ($) =>
    seq(token(/PRESELECT\s+/i), $.preselect_record_list),
  __do_transaction_phrase: ($) => tkw("TRANSACTION"),
  __do_query_tuning_phrase: ($) =>
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
  __do_stop_after_phrase: ($) =>
    seq(kw("STOP-AFTER"), field("time", $._expression)),
  __do_on_endkey_phrase: ($) =>
    seq(kw("ON"), kw("ENDKEY"), alias($.__do_on_endkey_undo, $.undo_phrase)),
  __do_on_endkey_undo: ($) =>
    seq(
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__do_on_endkey_action)),
    ),
  __do_on_endkey_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__do_on_endkey_return,
    ),
  __do_on_endkey_return: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          seq(tkw("ERROR"), optional(field("error_value", $._expression))),
          tkw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
  __do_on_stop_phrase: ($) =>
    seq(kw("ON"), kw("STOP"), alias($.__do_undo_phrase, $.undo_phrase)),
  __do_on_error_phrase: ($) =>
    seq(kw("ON"), kw("ERROR"), alias($.__do_undo_phrase, $.undo_phrase)),
  __do_on_quit_phrase: ($) =>
    seq(
      kw("ON"),
      tkw("QUIT"),
      optional(seq(tkw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $.__do_on_quit_action)),
    ),
  __do_on_quit_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__do_on_quit_return,
    ),
  __do_on_quit_return: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          seq(tkw("ERROR"), optional(field("error_value", $._expression))),
          tkw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
  __do_undo_phrase: ($) =>
    seq(
      tkw("UNDO"),
      ",",
      choice(tkw("THROW"), tkw("LEAVE"), tkw("NEXT"), tkw("RETRY")),
    ),
  __do_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __do_undo_leave_phrase: ($) =>
    seq(
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      tkw("LEAVE"),
      optional(field("leave_label", $.identifier)),
    ),
});
