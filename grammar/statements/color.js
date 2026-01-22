module.exports = ({ kw, tkw }) => ({
  color_statement: ($) =>
    seq(
      tkw("COLOR"),
      optional(kw("DISPLAY")),
      field("color", $._expression),
      optional(seq(kw("PROMPT"), field("prompt_color", $._expression))),
      repeat1(field("field", $._expression)),
      optional(alias($.__color_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __color_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
