export default ({ kw }) => ({
  combo_box_phrase: ($) =>
    seq(
      field("widget", $._kw_combo_box),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        choice(
          $._list_items_phrase,
          $._list_item_pairs_phrase,
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._kw_inner_lines, field("inner_lines", $.number_literal)),
          $.size_phrase,
          alias(kw("SORT"), $.sort),
          $._tooltip_phrase,
          alias(kw("SIMPLE"), $.simple),
          alias(kw("DROP-DOWN"), $.drop_down),
          alias(kw("DROP-DOWN-LIST"), $.drop_down_list),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._kw_max_chars, field("max_chars", $.number_literal)),
          seq(kw("AUTO-COMPLETION"), optional(alias(kw("UNIQUE-MATCH"), $.unique_match))),
        ),
      ),
    ),
});
