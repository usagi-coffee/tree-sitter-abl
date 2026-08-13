export default ({ kw }) => ({
  selection_list_phrase: ($) =>
    seq(
      kw("SELECTION-LIST"),
      repeat(
        choice(
          kw("SINGLE"),
          kw("MULTIPLE"),
          kw("NO-DRAG"),
          $._list_items_phrase,
          $._list_item_pairs_phrase,
          kw("SCROLLBAR-HORIZONTAL"),
          kw("SCROLLBAR-VERTICAL"),
          $.size_phrase,
          seq(
            kw("INNER-CHARS"),
            field("inner_chars", $.number_literal),
            kw("INNER-LINES"),
            field("inner_lines", $.number_literal),
          ),
          kw("SORT"),
          $._tooltip_phrase,
        ),
      ),
    ),
});
