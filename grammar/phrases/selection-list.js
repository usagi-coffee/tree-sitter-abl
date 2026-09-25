export default ({ kw }) => ({
  selection_list_phrase: ($) => seq($._kw_selection_list, optional($.__selection_list_options)),
  __selection_list_options: ($) =>
    prec.right(seq($.__selection_list_option, optional($.__selection_list_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __selection_list_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("SINGLE"),
      kw("MULTIPLE"),
      kw("NO-DRAG"),
      $._list_items_phrase,
      $._list_item_pairs_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("SCROLLBAR-HORIZONTAL"),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("SCROLLBAR-VERTICAL"),
      $.size_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        $._inner_chars_value,
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
        $._kw_inner_lines,
        field("inner_lines", $.number_literal),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("SORT"),
      $._tooltip_phrase,
    ),
});
