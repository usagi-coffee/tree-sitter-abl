export default ({ kw }) => ({
  radio_set_phrase: ($) =>
    seq(
      kw("RADIO-SET"),
      optional($.__radio_set_orientation),
      optional($.size_phrase),
      kw("RADIO-BUTTONS"),
      field("buttons", $.__radio_set_button_list),
      optional($.size_phrase),
      optional($._tooltip_phrase),
    ),

  __radio_set_orientation: ($) =>
    choice(seq(kw("HORIZONTAL"), optional(kw("EXPAND"))), kw("VERTICAL")),
  __radio_set_button_list: ($) => seq($._list_item_pair, repeat(seq(",", $._list_item_pair))),
});
