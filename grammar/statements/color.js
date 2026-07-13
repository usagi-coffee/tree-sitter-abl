export default ({ kw }) => ({
  color_statement: ($) => seq($.__color_prefix, $._terminator),

  __color_prefix: ($) => seq(kw("COLOR"), optional(choice($.__color_body, $.__color_prompt_body))),

  __color_body: ($) => seq(optional(alias(kw("DISPLAY"), $.display)), $.__color_tail),

  __color_prompt_body: ($) => seq(kw("PROMPT"), $.__color_tail),
  __color_tail: ($) =>
    seq(
      field("color", $.color_phrase),
      optional(seq(kw("PROMPT"), field("prompt_color", $.color_phrase))),
      repeat1($.__color_field),
      optional($.frame_phrase),
    ),

  __color_field: ($) => choice($._identifier_or_qualified_name, $.scoped_name, $.input_expression),
});
