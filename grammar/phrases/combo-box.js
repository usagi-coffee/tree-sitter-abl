module.exports = ({ kw }) => ({
  combo_box_phrase: ($) =>
    seq(
      kw("COMBO-BOX"),
      optional(choice($.__combo_box_list_items, $.__combo_box_list_item_pairs)),
      optional(seq(kw("INNER-LINES"), field("inner_lines", $.number_literal))),
      optional($.size_phrase),
      optional(kw("SORT")),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
      optional(choice(kw("SIMPLE"), kw("DROP-DOWN"), kw("DROP-DOWN-LIST"))),
      optional(seq(kw("MAX-CHARS"), field("max_chars", $.number_literal))),
      optional(
        seq(kw("AUTO-COMPLETION"), optional(kw("UNIQUE-MATCH"))),
      ),
    ),

  __combo_box_list_items: ($) =>
    seq(kw("LIST-ITEMS"), field("items", $.__combo_box_item_list)),
  __combo_box_item_list: ($) =>
    seq($._expression, repeat(seq(",", $._expression))),
  __combo_box_list_item_pairs: ($) =>
    seq(
      kw("LIST-ITEM-PAIRS"),
      field("pairs", $.__combo_box_item_pair_list),
    ),
  __combo_box_item_pair_list: ($) =>
    seq($.__combo_box_item_pair, repeat(seq(",", $.__combo_box_item_pair))),
  __combo_box_item_pair: ($) =>
    seq(field("label", $._expression), ",", field("value", $._expression)),
});
