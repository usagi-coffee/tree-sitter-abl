module.exports = ({ kw }) => ({
  color_statement: ($) =>
    seq(
      kw("COLOR"),
      optional(choice($.__color_body, $.__color_prompt_body)),
      $._terminator,
    ),

  __color_body: ($) =>
    seq(
      optional(kw("DISPLAY")),
      field("color", $.color_phrase),
      optional(seq(kw("PROMPT"), field("prompt_color", $.color_phrase))),
      repeat1($.__color_field),
      optional($.frame_phrase),
    ),

  __color_prompt_body: ($) =>
    seq(
      kw("PROMPT"),
      field("color", $.color_phrase),
      repeat1($.__color_field),
      optional($.frame_phrase),
    ),

  __color_field: ($) =>
    choice($._identifier_or_qualified_name, $.scoped_name, $.input_expression),
});
