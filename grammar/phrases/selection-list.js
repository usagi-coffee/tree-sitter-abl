module.exports = ({ kw }) => ({
  selection_list_phrase: ($) =>
    seq(
      kw("SELECTION-LIST"),
      optional(choice(kw("SINGLE"), kw("MULTIPLE"))),
      optional(kw("NO-DRAG")),
      optional(
        choice(
          $.__selection_list_items,
          $.__selection_list_item_pairs,
        ),
      ),
      optional(kw("SCROLLBAR-HORIZONTAL")),
      optional(kw("SCROLLBAR-VERTICAL")),
      optional(
        choice(
          $.size_phrase,
          seq(
            kw("INNER-CHARS"),
            field("inner_chars", $.number_literal),
            kw("INNER-LINES"),
            field("inner_lines", $.number_literal),
          ),
        ),
      ),
      optional(kw("SORT")),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
    ),

  __selection_list_items: ($) =>
    seq(kw("LIST-ITEMS"), field("items", $.__selection_list_item_list)),
  __selection_list_item_list: ($) =>
    seq($._expression, repeat(seq(",", $._expression))),
  __selection_list_item_pairs: ($) =>
    seq(
      kw("LIST-ITEM-PAIRS"),
      field("pairs", $.__selection_list_item_pair_list),
    ),
  __selection_list_item_pair_list: ($) =>
    seq(
      $.__selection_list_item_pair,
      repeat(seq(",", $.__selection_list_item_pair)),
    ),
  __selection_list_item_pair: ($) =>
    seq(field("label", $._expression), ",", field("value", $._expression)),
});
