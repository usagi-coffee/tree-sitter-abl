export default ({ kw }) => ({
  on_quit_phrase: ($) =>
    seq(
      $._on_keyword,
      kw("QUIT"),
      optional(seq(kw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional(seq(",", $._on_phrase_action)),
    ),
});
