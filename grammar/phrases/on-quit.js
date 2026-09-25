export default ({ kw }) => ({
  on_quit_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_on,
      $._kw_quit,
      optional(seq($._kw_undo, optional(field("undo_label", $.identifier)))),
      optional($._on_action_tail),
    ),
});
