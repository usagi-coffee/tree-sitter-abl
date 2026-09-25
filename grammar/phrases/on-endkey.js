export default ({ kw }) => ({
  on_endkey_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._on_keyword,
      choice($._kw_endkey, kw("END-KEY")),
      $._kw_undo,
      optional(field("undo_label", $.identifier)),
      optional($._on_action_tail),
    ),
});
