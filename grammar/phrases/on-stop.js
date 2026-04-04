module.exports = ({ kw }) => ({
  on_stop_phrase: ($) =>
    seq(
      kw("ON"),
      kw("STOP"),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $.__on_stop_action,
    ),

  __on_stop_action: ($) => choice($.__undo_lnr_target, $.__on_phrase_return),
});
