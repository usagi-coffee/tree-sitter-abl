module.exports = ({ kw }) => ({
  do_statement: ($) =>
    seq(optional($._label), $.__do_body, kw("END"), $._terminator),

  __do_body: ($) =>
    seq(
      kw("DO"),
      optional(alias($.__do_for_phrase, $.for_phrase)),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      optional($.__do_transaction_phrase),
      optional(choice($.__do_while_phrase, $.__do_loop_phrase)),
      optional($.__do_transaction_phrase),
      optional($.stop_after_phrase),
      repeat(
        choice(
          $.on_endkey_phrase,
          $.on_stop_phrase,
          $.on_error_phrase,
          $.on_quit_phrase,
        ),
      ),
      repeat($.frame_phrase),
      $.body,
    ),

  body: ($) =>
    prec.right(
      seq(
        choice(alias($._colon, ":"), $._terminator_dot),
        repeat($._statement),
      ),
    ),

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
  __do_record: ($) => field("record", $._identifier_or_qualified_name),
  __do_transaction_phrase: ($) => kw("TRANSACTION"),
  __do_undo_phrase: ($) =>
    seq(
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $.__do_on_undo_action,
    ),
  __do_on_undo_action: ($) =>
    choice(
      seq(kw("THROW"), optional(field("throw_value", $._expression))),
      seq(kw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(kw("NEXT"), optional(field("next_label", $.identifier))),
      seq(kw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__do_on_undo_return,
    ),
  __do_on_undo_return: ($) =>
    seq(
      kw("RETURN"),
      optional(
        choice(
          seq(kw("ERROR"), optional(field("error_value", $._expression))),
          kw("NO-APPLY"),
          field("return_value", $._expression),
        ),
      ),
    ),
  __do_undo_throw_phrase: ($) => seq(kw("UNDO"), ",", kw("THROW")),
  __do_undo_leave_phrase: ($) =>
    seq(
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      kw("LEAVE"),
      optional(field("leave_label", $.identifier)),
    ),
});
