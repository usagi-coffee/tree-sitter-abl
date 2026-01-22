module.exports = ({ kw, tkw }) => ({
  do_block: ($) =>
    prec(
      1,
      seq(
        optional(seq(field("label", $.identifier), $._colon)),
        tkw("DO"),
        optional($.__do_transaction_clause),
        optional($.__do_preselect_clause),
        optional(choice($.__do_while_clause, $.__do_loop_clause)),
        optional($.__do_transaction_clause),
        optional(alias($.__do_on_endkey_clause, $.on_endkey_clause)),
        optional(
          choice(
            alias($.__do_on_error_clause, $.on_error_clause),
            alias($.__do_on_quit_clause, $.on_quit_clause),
          ),
        ),
        $.body,
        tkw("END"),
        $._terminator,
      ),
    ),

  body: ($) => seq(choice($._colon, $._terminator_dot), repeat($._statement)),

  __do_loop_clause: ($) =>
    seq(
      field("variable", $.identifier),
      "=",
      field("start", $._expression),
      kw("TO"),
      field("end", $._expression),
      optional(seq(kw("BY"), field("step", $._expression))),
    ),
  __do_while_clause: ($) => seq(kw("WHILE"), $._expression),
  __do_preselect_clause: ($) =>
    seq(token(/PRESELECT\s+/i), $.preselect_record_list),
  __do_transaction_clause: ($) => tkw("TRANSACTION"),
  __do_on_endkey_clause: ($) =>
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
  __do_on_error_clause: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      choice(
        alias($.__do_undo_throw_phrase, $.undo_throw_phrase),
        alias($.__do_undo_leave_phrase, $.undo_leave_phrase),
      ),
    ),
  __do_on_quit_clause: ($) =>
    seq(kw("ON"), tkw("QUIT"), ",", tkw("LEAVE")),
  __do_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __do_undo_leave_phrase: ($) => seq(tkw("UNDO"), ",", tkw("LEAVE")),
});
