export default ({ kw }) => ({
  on_error_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._on_keyword,
      kw("ERROR"),
      $._kw_undo,
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__on_error_action)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __on_error_action: ($) =>
    choice(seq(kw("THROW"), optional(field("throw_value", $._expression))), $._on_phrase_action),
});
