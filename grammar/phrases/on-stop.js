export default ({ kw }) => ({
  on_stop_phrase: ($) =>
    seq(
      $._on_keyword,
      kw("STOP"),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      ",",
      $._on_phrase_action,
    ),
});
