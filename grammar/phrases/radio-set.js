module.exports = ({ kw }) => ({
  radio_set_phrase: ($) =>
    seq(
      kw("RADIO-SET"),
      optional($.__radio_set_orientation),
      optional($.size_phrase),
      kw("RADIO-BUTTONS"),
      field("buttons", $.__radio_set_button_list),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
    ),

  __radio_set_orientation: ($) =>
    choice(seq(kw("HORIZONTAL"), optional(kw("EXPAND"))), kw("VERTICAL")),
  __radio_set_button_list: ($) =>
    seq($.__radio_set_button, repeat(seq(",", $.__radio_set_button))),
  __radio_set_button: ($) =>
    seq(field("label", $._expression), ",", field("value", $._expression)),
});
