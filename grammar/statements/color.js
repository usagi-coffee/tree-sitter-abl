export default ({ kw }) => ({
  color_statement: ($) => seq($.__color_prefix, $._terminator),

  __color_prefix: ($) => seq(kw("COLOR"), optional($.__color_body)),

  __color_body: ($) =>
    seq(optional(choice(alias(kw("DISPLAY"), $.display), kw("PROMPT"))), $.__color_tail),

  __color_tail: ($) =>
    seq(
      field("color", $.color_phrase),
      optional(seq(kw("PROMPT"), field("prompt_color", $.color_phrase))),
      repeat1(choice($._identifier_or_qualified_name, $.scoped_name, $.input_expression)),
      optional($.frame_phrase),
    ),
});
