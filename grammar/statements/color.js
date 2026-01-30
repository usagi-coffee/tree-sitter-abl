module.exports = ({ kw, tkw }) => ({
  color_statement: ($) => seq(tkw("COLOR"), $.__color_body, $._terminator),
  __color_body: ($) =>
    seq(
      optional(kw("DISPLAY")),
      field("color", $.color_phrase),
      optional(seq(kw("PROMPT"), field("prompt_color", $.color_phrase))),
      repeat1(field("field", $._expression)),
      optional($.frame_phrase),
    ),
});
