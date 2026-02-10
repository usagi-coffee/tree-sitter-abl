module.exports = ({ kw }) => ({
  form_statement: ($) => seq(kw("FORM"), $.__form_body, $._terminator),

  __form_body: ($) =>
    choice(
      seq(repeat1(alias($.__form_item, $.form_item)), repeat($.frame_phrase)),
      repeat1($.frame_phrase),
    ),

  __form_item: ($) =>
    prec.right(
      choice(
        prec(
          1,
          seq(
            alias(kw("MENU"), $.identifier),
            optional(alias(kw("NO-LABEL"), $.no_label)),
            optional(alias(kw("NO-LABELS"), $.no_labels)),
            optional(
              seq(
                kw("FORMAT", { offset: 4 }),
                field("format", $.string_literal),
              ),
            ),
          ),
        ),
        seq(
          field("field", $._expression),
          optional(seq(kw("COLON"), field("colon", $._expression))),
          optional(seq(kw("LABEL"), optional(field("label", $.__form_label)))),
          optional(alias($.__form_validate_phrase, $.validate_phrase)),
          optional(
            seq(kw("FORMAT", { offset: 4 }), field("format", $.string_literal)),
          ),
          optional(alias($.__form_view_as, $.view_as_phrase)),
        ),
        seq(kw("SKIP"), optional(seq("(", $._expression, ")"))),
        seq(kw("SPACE"), optional(seq("(", $._expression, ")"))),
      ),
    ),

  __form_view_as: ($) =>
    seq(
      kw("VIEW-AS"),
      choice(
        field("widget", $.identifier),
        seq(kw("RADIO-SET"), kw("RADIO-BUTTONS"), $.__form_radio_button_list),
      ),
    ),

  __form_radio_button_list: ($) =>
    seq($.__form_radio_button, repeat(seq(",", $.__form_radio_button))),
  __form_radio_button: ($) =>
    seq(field("label", $.string_literal), ",", field("value", $._expression)),
  __form_validate_phrase: ($) =>
    seq(
      kw("VALIDATE", { offset: 4 }),
      "(",
      field("expression", $._expression),
      repeat(seq(",", field("expression", $._expression))),
      ")",
    ),
  __form_label: ($) =>
    choice(
      $.include_expression,
      alias($.constant_expression, $.constant),
      $.string_literal,
      $._identifier_or_qualified_name,
    ),
});
