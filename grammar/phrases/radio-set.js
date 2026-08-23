export default ({ kw }) => ({
  radio_set_phrase: ($) =>
    seq(
      kw("RADIO-SET"),
      optional($.__radio_set_orientation_size_prefix),
      kw("RADIO-BUTTONS"),
      field("buttons", $._list_item_pairs),
      optional($.__radio_set_size_tooltip_tail),
    ),

  __radio_set_orientation_size_prefix: ($) =>
    choice(seq($.__radio_set_orientation, optional($.size_phrase)), $.size_phrase),
  __radio_set_size_tooltip_tail: ($) =>
    choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase),
  __radio_set_orientation: ($) =>
    choice(seq(kw("HORIZONTAL"), optional(kw("EXPAND"))), kw("VERTICAL")),
});
