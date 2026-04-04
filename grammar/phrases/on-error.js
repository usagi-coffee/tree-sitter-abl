module.exports = ({ kw }) => ({
  on_error_phrase: ($) =>
    seq(
      kw("ON"),
      kw("ERROR"),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $.__on_error_action,
    ),

  __on_error_action: ($) =>
    choice(
      seq(kw("THROW"), optional(field("throw_value", $._expression))),
      $.__undo_lnr_target,
      $.__on_phrase_return,
    ),
});
