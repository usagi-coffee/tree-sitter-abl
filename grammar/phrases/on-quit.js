export default ({ kw }) => ({
  on_quit_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._on_keyword,
      kw("QUIT"),
      optional(seq(kw("UNDO"), optional(field("undo_label", $.identifier)))),
      optional($._on_action_tail),
    ),
});
