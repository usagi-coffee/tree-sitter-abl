module.exports = ({ kw }) => ({
  choose_statement: ($) => seq(kw("CHOOSE"), $.__choose_body, $._terminator),

  __choose_body: ($) =>
    seq(
      choice(
        seq(kw("ROW"), $.__choose_field_help),
        seq(kw("FIELD"), repeat1($.__choose_field_help)),
      ),
      repeat(
        choice(
          alias(kw("AUTO-RETURN"), $.auto_return),
          seq(kw("COLOR"), field("color", $.color_phrase)),
          alias($.__choose_go_on, $.go_on),
          seq(kw("KEYS"), field("keys", $.identifier)),
          alias(kw("NO-ERROR"), $.no_error),
          seq(kw("PAUSE"), field("pause", $._expression)),
        ),
      ),
      optional($.frame_phrase),
    ),
  __choose_field_help: ($) =>
    seq(
      field("field", $._identifier_or_qualified_name),
      optional(seq(kw("HELP"), field("help", $.string_literal))),
    ),

  __choose_go_on: ($) =>
    seq(
      kw("GO-ON"),
      "(",
      choice(
        $.identifier,
        $.string_literal,
        seq(
          choice($.identifier, $.string_literal),
          repeat(seq(optional(","), choice($.identifier, $.string_literal))),
        ),
      ),
      ")",
    ),
});
