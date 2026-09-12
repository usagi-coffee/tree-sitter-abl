export default ({ kw }) => ({
  on_endkey_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._on_keyword,
      choice(kw("ENDKEY"), kw("END-KEY")),
      kw("UNDO"),
      optional(field("undo_label", $.identifier)),
      optional(seq(",", $._on_phrase_action)),
    ),
});
