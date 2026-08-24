export default ({ kw }) => ({
  on_quit_phrase: ($) =>
    seq(
      $._on_keyword,
      kw("QUIT"),
      optional(seq(kw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $.__on_quit_action)),
    ),

  __on_quit_action: ($) => choice($.__undo_lnr_target, $.__on_phrase_return),
});
