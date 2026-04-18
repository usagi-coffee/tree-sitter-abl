module.exports = ({ kw }) => ({
  prompt_for_statement: ($) => seq(kw("PROMPT-FOR"), $.__prompt_for_body, $._terminator),

  __prompt_for_body: ($) =>
    seq(
      optional($._stream_phrase),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      choice(prec(1, $.__prompt_for_fields_body), $.__prompt_for_record_body),
    ),

  __prompt_for_record_body: ($) =>
    seq(
      field("record", $.identifier),
      optional(seq(kw("EXCEPT"), repeat1(alias($._identifier_or_qualified_name, $.field)))),
      optional($.in_window_phrase),
      optional($.frame_phrase),
    ),

  __prompt_for_fields_body: ($) =>
    seq(
      repeat1(alias($.__prompt_for_field, $.field)),
      optional(alias($._go_on_phrase, $.go_on_phrase)),
      optional($.in_window_phrase),
      optional($.frame_phrase),
      optional(alias($.__prompt_for_with_phrase, $.with_phrase)),
      optional($.editing_phrase),
    ),

  __prompt_for_field: ($) =>
    choice(
      seq(
        field("field", $._identifier_or_qualified_name),
        optional($.format_phrase),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        kw("TEXT"),
        "(",
        repeat1(seq(field("field", $._identifier_or_qualified_name), optional($.format_phrase))),
        ")",
      ),
      seq(field("constant", $.string_literal), optional($.__prompt_for_constant_tail)),
      seq(kw("SKIP"), optional(field("skip", seq("(", $._expression, ")")))),
      seq(kw("SPACE"), optional(field("space", seq("(", $._expression, ")")))),
      "^",
    ),
  __prompt_for_constant_tail: ($) =>
    choice(
      seq(
        alias($.__prompt_for_at_phrase, $.at_phrase),
        optional($.__prompt_for_constant_tail_after_position),
      ),
      seq(
        alias($.__prompt_for_to_phrase, $.to_phrase),
        optional($.__prompt_for_constant_tail_after_position),
      ),
      seq(
        alias($.__prompt_for_view_as_phrase, $.view_as_phrase),
        optional($.__prompt_for_constant_tail_after_view_as),
      ),
      $.__prompt_for_constant_style_tail,
    ),
  __prompt_for_constant_tail_after_position: ($) =>
    choice(
      seq(
        alias($.__prompt_for_view_as_phrase, $.view_as_phrase),
        optional($.__prompt_for_constant_tail_after_view_as),
      ),
      $.__prompt_for_constant_style_tail,
    ),
  __prompt_for_constant_tail_after_view_as: ($) => choice($.__prompt_for_constant_style_tail),
  __prompt_for_constant_tail_after_fgcolor: ($) =>
    choice(
      seq(
        kw("BGCOLOR"),
        field("bgcolor", $._expression),
        optional($.__prompt_for_constant_tail_after_bgcolor),
      ),
      seq(kw("FONT"), field("font", $._expression)),
    ),
  __prompt_for_constant_tail_after_bgcolor: ($) => seq(kw("FONT"), field("font", $._expression)),
  __prompt_for_constant_style_tail: ($) =>
    choice(
      seq(
        kw("FGCOLOR"),
        field("fgcolor", $._expression),
        optional($.__prompt_for_constant_tail_after_fgcolor),
      ),
      seq(
        kw("BGCOLOR"),
        field("bgcolor", $._expression),
        optional($.__prompt_for_constant_tail_after_bgcolor),
      ),
      seq(kw("FONT"), field("font", $._expression)),
    ),

  __prompt_for_at_phrase: ($) => seq(kw("AT"), field("position", token(/[0-9]+(\.[0-9]+)?/))),
  __prompt_for_to_phrase: ($) => seq(kw("TO"), field("position", token(/[0-9]+(\.[0-9]+)?/))),
  __prompt_for_view_as_phrase: ($) => seq(kw("VIEW-AS"), field("widget", $.identifier)),
  __prompt_for_with_phrase: ($) => seq(kw("WITH"), alias(kw("NO-VALIDATE"), $.no_validate)),
});
