module.exports = ({ kw, tkw }) => ({
  choose_statement: ($) =>
    seq(
      tkw("CHOOSE"),
      choice(
        seq(kw("ROW"), field("field", $.identifier), optional(seq(kw("HELP"), $.string_literal))),
        seq(kw("FIELD"), repeat1(seq(field("field", $.identifier), optional(seq(kw("HELP"), $.string_literal))))),
      ),
      optional(tkw("AUTO-RETURN")),
      optional(seq(kw("COLOR"), field("color", $._expression))),
      optional(seq(kw("GO-ON"), "(", repeat1($.identifier), ")")),
      optional(seq(kw("KEYS"), field("keys", $.identifier))),
      optional(tkw("NO-ERROR")),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      optional(alias($.__choose_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __choose_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
