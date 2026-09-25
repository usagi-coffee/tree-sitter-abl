export default ({ kw }) => ({
  on_stop_phrase: ($) =>
    seq(
      $._on_keyword,
      $._kw_stop,
      $._kw_undo,
      optional(field("undo_label", $.identifier)),
      $._on_action_tail,
    ),
});
