export default ({ kw }) => ({
  prompt_for_statement: ($) => seq($.__prompt_for_statement_body, $._terminator),

  __prompt_for_statement_body: ($) => seq($.__prompt_for_prefix, $.__prompt_for_body),
  __prompt_for_prefix: ($) =>
    seq(
      kw("PROMPT-FOR"),
      optional($._stream_phrase),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
    ),
  __prompt_for_body: ($) => choice($.__prompt_for_fields_body, $.__prompt_for_record_body),

  __prompt_for_record_body: ($) =>
    seq(
      field("record", $.identifier),
      optional(seq(kw("EXCEPT"), $.__prompt_for_except_fields)),
      optional($.in_window_phrase),
      optional($.frame_phrase),
    ),

  __prompt_for_fields_body: ($) =>
    seq(
      $.__prompt_for_fields,
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($.__prompt_for_fields_tail),
      optional($.editing_phrase),
    ),
  __prompt_for_except_fields: ($) =>
    prec.right(
      seq(alias($._identifier_or_qualified_name, $.field), optional($.__prompt_for_except_fields)),
    ),
  __prompt_for_fields_tail: ($) =>
    choice(
      seq($.in_window_phrase, optional($.__prompt_for_fields_after_window)),
      $.__prompt_for_fields_after_window,
    ),
  __prompt_for_fields_after_window: ($) =>
    choice(
      seq($.frame_phrase, optional(alias($.__prompt_for_with_phrase, $.with_phrase))),
      alias($.__prompt_for_with_phrase, $.with_phrase),
    ),

  __prompt_for_field: ($) =>
    choice(
      seq(
        field("field", $._identifier_or_qualified_name),
        optional($.format_phrase),
        optional($._when_phrase),
      ),
      seq(
        kw("TEXT"),
        "(",
        repeat1(seq(field("field", $._identifier_or_qualified_name), optional($.format_phrase))),
        ")",
      ),
      seq(field("constant", $.string_literal), optional($.__prompt_for_constant_tail)),
      seq(kw("SKIP"), optional(field("skip", $._parenthesized_value))),
      seq(kw("SPACE"), optional(field("space", $._parenthesized_value))),
      "^",
    ),
  __prompt_for_fields: ($) =>
    prec.right(seq(alias($.__prompt_for_field, $.field), optional($.__prompt_for_fields))),
  __prompt_for_constant_tail: ($) =>
    choice(
      seq(
        alias($.__prompt_for_at_phrase, $.at_phrase),
        optional($.__prompt_for_constant_after_position),
      ),
      seq(
        alias($.__prompt_for_to_phrase, $.to_phrase),
        optional($.__prompt_for_constant_after_position),
      ),
      $.__prompt_for_constant_after_position,
    ),
  __prompt_for_constant_after_position: ($) =>
    choice(
      seq(
        alias($.__prompt_for_view_as_phrase, $.view_as_phrase),
        optional($.__prompt_for_constant_style_tail),
      ),
      $.__prompt_for_constant_style_tail,
    ),
  __prompt_for_constant_style_tail: ($) =>
    choice(
      seq(
        kw("FGCOLOR"),
        field("fgcolor", $._expression),
        optional($.__prompt_for_constant_style_after_fgcolor),
      ),
      $.__prompt_for_constant_style_after_fgcolor,
    ),
  __prompt_for_constant_style_after_fgcolor: ($) =>
    choice(
      seq(kw("BGCOLOR"), field("bgcolor", $._expression), optional($.__prompt_for_font_option)),
      $.__prompt_for_font_option,
    ),
  __prompt_for_font_option: ($) => seq(kw("FONT"), field("font", $._expression)),

  __prompt_for_at_phrase: ($) => seq($._at_keyword, field("position", token(/[0-9]+(\.[0-9]+)?/))),
  __prompt_for_to_phrase: ($) => seq($._to_keyword, field("position", token(/[0-9]+(\.[0-9]+)?/))),
  __prompt_for_view_as_phrase: ($) => seq(kw("VIEW-AS"), field("widget", $.identifier)),
  __prompt_for_with_phrase: ($) => seq($._with_keyword, alias(kw("NO-VALIDATE"), $.no_validate)),
});
