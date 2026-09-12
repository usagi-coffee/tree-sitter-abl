export default ({ kw }) => ({
  on_error_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._on_keyword,
      kw("ERROR"),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $.__on_error_action)),
    ),

  __on_error_action: ($) =>
    choice(
      seq(kw("THROW"), optional(field("throw_value", $._expression))),
      $._undo_lnr_target,
      $._on_phrase_return,
    ),
});
