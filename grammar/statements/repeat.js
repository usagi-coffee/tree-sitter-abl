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
      optional(alias($.__repeat_on_stop_clause, $.on_stop_clause)),
      optional(alias($.__repeat_on_error_clause, $.on_error_clause)),
      $.body,
      tkw("END"),
      $._terminator,
    ),

  __repeat_on_stop_clause: ($) =>
    seq(
      kw("ON"),
      kw("STOP"),
      alias($.__repeat_undo_return_error, $.undo_return_error),
    ),

  __repeat_on_error_clause: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      alias($.__repeat_undo_throw_phrase, $.undo_throw_phrase),
    ),

  __repeat_undo_throw_phrase: ($) => seq(tkw("UNDO"), ",", tkw("THROW")),
  __repeat_undo_return_error: ($) =>
    seq(
      tkw("UNDO"),
      ",",
      tkw("RETURN"),
      tkw("ERROR"),
      $.new_expression,
    ),
});
