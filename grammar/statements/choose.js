module.exports = ({ kw, tkw }) => ({
  choose_statement: ($) =>
    seq(
      tkw("CHOOSE"),
      $.__choose_body,
      $._terminator,
    ),
  __choose_body: ($) =>
    seq(
      choice(
        seq(kw("ROW"), field("field", $.identifier), optional(seq(kw("HELP"), $.string_literal))),
        seq(kw("FIELD"), repeat1(seq(field("field", $.identifier), optional(seq(kw("HELP"), $.string_literal))))),
      ),
      optional(tkw("AUTO-RETURN")),
      optional(seq(kw("COLOR"), field("color", $.__choose_color_value))),
      optional(seq(tkw("GO-ON"), "(", repeat1($.identifier), ")")),
      optional(seq(kw("KEYS"), field("keys", $.identifier))),
      optional(tkw("NO-ERROR")),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      optional(alias($.__choose_frame_phrase, $.frame_phrase)),
    ),
  __choose_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
  __choose_color_value: ($) => $._expression,
});
