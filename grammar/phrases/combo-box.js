module.exports = ({ kw }) => ({
  combo_box_phrase: ($) =>
    seq(
      field("widget", kw("COMBO-BOX")),
      optional(choice($.__combo_box_list_items, $.__combo_box_list_item_pairs)),
      repeat($.__combo_box_option),
    ),
  __combo_box_option: ($) =>
    choice(
      seq(kw("INNER-LINES"), field("inner_lines", $.number_literal)),
      $.size_phrase,
      alias(kw("SORT"), $.sort),
      seq(kw("TOOLTIP"), field("tooltip", $._expression)),
      alias(kw("SIMPLE"), $.simple),
      alias(kw("DROP-DOWN"), $.drop_down),
      alias(kw("DROP-DOWN-LIST"), $.drop_down_list),
      seq(kw("MAX-CHARS"), field("max_chars", $.number_literal)),
      seq(
        kw("AUTO-COMPLETION"),
        optional(alias(kw("UNIQUE-MATCH"), $.unique_match)),
      ),
    ),
  __combo_box_list_items: ($) =>
    seq(kw("LIST-ITEMS"), field("items", $.__combo_box_item_list)),
  __combo_box_item_list: ($) =>
    seq($._expression, repeat(seq(",", $._expression))),
  __combo_box_list_item_pairs: ($) =>
    seq(kw("LIST-ITEM-PAIRS"), field("pairs", $.__combo_box_item_pair_list)),
  __combo_box_item_pair_list: ($) =>
    seq($.__combo_box_item_pair, repeat(seq(",", $.__combo_box_item_pair))),
  __combo_box_item_pair: ($) =>
    seq(field("label", $._expression), ",", field("value", $._expression)),
});
