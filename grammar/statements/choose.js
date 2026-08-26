export default ({ kw }) => ({
  choose_statement: ($) => seq($.__choose_prefix, $._terminator),

  __choose_prefix: ($) =>
    seq(
      kw("CHOOSE"),
      choice(seq($._row_keyword, $.__choose_field_help), seq(kw("FIELD"), $.__choose_field_helps)),
      repeat(
        choice(
          alias(kw("AUTO-RETURN"), $.auto_return),
          seq(kw("COLOR"), field("color", $.color_phrase)),
          alias($._go_on_phrase, $.go_on),
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
      optional(seq($._help_keyword, field("help", $.string_literal))),
    ),
  __choose_field_helps: ($) =>
    prec.right(seq($.__choose_field_help, optional($.__choose_field_helps))),
});
