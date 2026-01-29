module.exports = ({ kw, tkw }) => ({
  color_statement: ($) => seq(tkw("COLOR"), $.__color_body, $._terminator),
  __color_body: ($) =>
    seq(
      optional(kw("DISPLAY")),
      field("color", alias($.__color_color_phrase, $.color_phrase)),
      optional(
        seq(
          kw("PROMPT"),
          field("prompt_color", alias($.__color_color_phrase, $.color_phrase)),
        ),
      ),
      repeat1(field("field", $._expression)),
      optional(alias($.__color_frame_phrase, $.frame_phrase)),
    ),
  __color_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
  __color_color_phrase: ($) =>
    choice(
      $.number_literal,
      $.string_literal,
      seq(tkw("VALUE"), "(", field("value", $._expression), ")"),
      seq(
        repeat1(
          choice(tkw("BLINK-"), tkw("BRIGHT-"), tkw("RVV-"), tkw("UNDERLINE-")),
        ),
        field("foreground", $.identifier),
      ),
      $.identifier,
    ),
});
