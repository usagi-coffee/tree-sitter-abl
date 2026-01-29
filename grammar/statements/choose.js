module.exports = ({ kw, tkw }) => ({
  choose_statement: ($) => seq(tkw("CHOOSE"), $.__choose_body, $._terminator),
  __choose_body: ($) =>
    seq(
      choice(
        seq(
          kw("ROW"),
          field("field", choice($.identifier, $.qualified_name)),
          optional(seq(kw("HELP"), $.string_literal)),
        ),
        seq(
          kw("FIELD"),
          repeat1(
            seq(
              field("field", choice($.identifier, $.qualified_name)),
              optional(seq(kw("HELP"), $.string_literal)),
            ),
          ),
        ),
      ),
      repeat(
        choice(
          alias($.__choose_auto_return, $.auto_return),
          seq(kw("COLOR"), field("color", $.color_phrase)),
          alias($.__choose_go_on, $.go_on),
          seq(kw("KEYS"), field("keys", $.identifier)),
          alias($.__choose_no_error, $.no_error),
          seq(kw("PAUSE"), field("pause", $._expression)),
        ),
      ),
      optional(alias($.__choose_frame_phrase, $.frame_phrase)),
    ),
  __choose_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
  __choose_auto_return: ($) => tkw("AUTO-RETURN"),
  __choose_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __choose_no_error: ($) => tkw("NO-ERROR"),
  __choose_color_value: ($) => $._expression,
});
