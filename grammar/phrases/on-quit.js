module.exports = ({ kw }) => ({
  on_quit_phrase: ($) =>
    seq(
      kw("ON"),
      kw("QUIT"),
      optional(seq(kw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $.__on_quit_action)),
    ),

  __on_quit_action: ($) => choice($.__undo_lnr_target, $.__on_phrase_return),
});
