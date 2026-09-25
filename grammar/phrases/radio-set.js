export default ({ kw }) => ({
  radio_set_phrase: ($) =>
    seq(
      $._kw_radio_set,
      optional($.__radio_set_orientation_size_prefix),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("RADIO-BUTTONS"),
      field("buttons", $._list_item_pairs),
      optional($.__radio_set_size_tooltip_tail),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __radio_set_orientation_size_prefix: ($) =>
    choice(seq($.__radio_set_orientation, optional($.size_phrase)), $.size_phrase),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __radio_set_size_tooltip_tail: ($) =>
    choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __radio_set_orientation: ($) =>
    choice(seq($._kw_horizontal, optional(kw("EXPAND"))), $._kw_vertical),
});
