module.exports = ({ kw, tkw }) => ({
  form_statement: ($) => seq(tkw("FORM"), $.__form_body, $._terminator),
  __form_body: ($) =>
    seq(
      repeat1(alias($.__form_item, $.form_item)),
      optional($.frame_phrase),
    ),
  __form_item: ($) =>
    prec.right(
      choice(
        seq(
          field("field", $._expression),
          optional(seq(kw("COLON"), field("colon", $._expression))),
          optional(seq(kw("LABEL"), field("label", $.string_literal))),
          optional(seq(kw("FORMAT"), field("format", $.string_literal))),
          optional(alias($.__form_view_as, $.view_as_phrase)),
        ),
        seq(tkw("SKIP"), optional(seq("(", $._expression, ")"))),
        seq(tkw("SPACE"), optional(seq("(", $._expression, ")"))),
      ),
    ),
  __form_view_as: ($) =>
    seq(
      kw("VIEW-AS"),
      choice(
        field("widget", $.identifier),
        seq(
          kw("RADIO-SET"),
          kw("RADIO-BUTTONS"),
          $.__form_radio_button_list,
        ),
      ),
    ),
  __form_radio_button_list: ($) =>
    seq(
      $.__form_radio_button,
      repeat(seq(",", $.__form_radio_button)),
    ),
  __form_radio_button: ($) =>
    seq(
      field("label", $.string_literal),
      ",",
      field("value", $._expression),
    ),
});
