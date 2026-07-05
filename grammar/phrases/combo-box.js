module.exports = ({ kw }) => ({
  combo_box_phrase: ($) =>
    seq(
      field("widget", kw("COMBO-BOX")),
      optional(choice($._list_items_phrase, $._list_item_pairs_phrase)),
      repeat(
        choice(
          seq(kw("INNER-LINES"), field("inner_lines", $.number_literal)),
          $.size_phrase,
          alias(kw("SORT"), $.sort),
          $._tooltip_phrase,
          alias(kw("SIMPLE"), $.simple),
          alias(kw("DROP-DOWN"), $.drop_down),
          alias(kw("DROP-DOWN-LIST"), $.drop_down_list),
          seq(kw("MAX-CHARS"), field("max_chars", $.number_literal)),
          seq(kw("AUTO-COMPLETION"), optional(alias(kw("UNIQUE-MATCH"), $.unique_match))),
        ),
      ),
    ),
});
