module.exports = ({ kw, tkw }) => ({
  repeat_statement: ($) =>
    seq(
      optional(seq(field("label", $.identifier), $._colon)),
      tkw("REPEAT"),
      optional(
        choice(
          seq(choice(kw("WHILE"), kw("UNTIL")), $._expression),
          seq(kw("PRESELECT"), $.preselect_record_list),
        ),
      ),
      // FIXME: this shouldn't be repeat but we need to save on state counts
      repeat(
        choice(
          alias($.__repeat_on_endkey_phrase, $.on_endkey_phrase),
          alias($.__repeat_on_stop_phrase, $.on_stop_phrase),
          alias($.__repeat_on_error_phrase, $.on_error_phrase),
          alias($.__repeat_on_quit_phrase, $.on_quit_phrase),
        ),
      ),
      $.body,
      tkw("END"),
      $._terminator,
    ),

  __repeat_on_stop_phrase: ($) =>
    seq(
      kw("ON"),
      kw("STOP"),
      alias($.__repeat_undo_return_error, $.undo_return_error),
    ),

  __repeat_on_error_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      alias($.__repeat_undo_throw_phrase, $.undo_throw_phrase),
    ),

  __repeat_on_endkey_phrase: ($) =>
    seq(kw("ON"), kw("ENDKEY"), alias($.__repeat_on_endkey_undo, $.undo_phrase)),
  __repeat_on_endkey_undo: ($) =>
    seq(
      tkw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__repeat_on_endkey_action)),
    ),
  __repeat_on_endkey_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__repeat_on_endkey_return,
    ),
  __repeat_on_endkey_return: ($) =>
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

  __repeat_on_quit_phrase: ($) =>
    seq(
      kw("ON"),
      kw("QUIT"),
      optional(seq(tkw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $.__repeat_on_quit_action)),
    ),
  __repeat_on_quit_action: ($) =>
    choice(
      seq(tkw("LEAVE"), optional(field("leave_label", $.identifier))),
      seq(tkw("NEXT"), optional(field("next_label", $.identifier))),
      seq(tkw("RETRY"), optional(field("retry_label", $.identifier))),
      $.__repeat_on_quit_return,
    ),
  __repeat_on_quit_return: ($) =>
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

  __repeat_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __repeat_undo_return_error: ($) =>
    seq(tkw("UNDO"), ",", tkw("RETURN"), tkw("ERROR"), $.new_expression),
});
