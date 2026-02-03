module.exports = ({ kw }) => ({
  choose_statement: ($) => seq(kw("CHOOSE"), $.__choose_body, $._terminator),

  __choose_body: ($) =>
    seq(
      choice(
        seq(
          kw("ROW"),
          field("field", $._identifier_or_qualified_name),
          optional(seq(kw("HELP"), $.string_literal)),
        ),
        seq(
          kw("FIELD"),
          repeat1(
            seq(
              field("field", $._identifier_or_qualified_name),
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
      optional($.frame_phrase),
    ),

  __choose_auto_return: ($) => kw("AUTO-RETURN"),
  __choose_go_on: ($) => seq(kw("GO-ON"), "(", repeat1($.identifier), ")"),
  __choose_no_error: ($) => kw("NO-ERROR"),
  __choose_color_value: ($) => $._expression,
});
