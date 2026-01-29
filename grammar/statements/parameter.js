module.exports = ({ kw, tkw }) => ({
  parameter_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(choice(kw("INPUT"), kw("OUTPUT"), kw("INPUT-OUTPUT"))),
      optional(kw("RETURN")),
      kw("PARAMETER"),
      $.__parameter_body,
      $._terminator,
    ),

  __parameter_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(
        choice(
          seq(
            kw("AS"),
            optional(kw("CLASS")),
            field("type", $._type_or_string),
            optional(seq(kw("TO"), $.identifier)),
          ),
          seq(kw("LIKE"), field("like", $.__parameter_field_name)),
        ),
      ),
      repeat(
        choice(
          alias($.__parameter_append_option, $.append_option),
          alias($.__parameter_bind_option, $.bind_option),
          alias($.__parameter_by_reference_option, $.by_reference_option),
          alias($.__parameter_by_value_option, $.by_value_option),
          alias($.__parameter_extent_phrase, $.extent_phrase),
          alias($.__parameter_format_option, $.format_option),
          alias($.__parameter_initial_option, $.initial_option),
          alias($.__parameter_label_option, $.label_option),
          alias($.__parameter_no_undo, $.no_undo),
        ),
      ),
    ),

  __parameter_append_option: ($) => tkw("APPEND"),
  __parameter_bind_option: ($) => kw("BIND"),
  __parameter_by_reference_option: ($) =>
    seq(kw("BY-REFERENCE"), optional(kw("BIND"))),
  __parameter_by_value_option: ($) => tkw("BY-VALUE"),
  __parameter_extent_phrase: ($) =>
    seq(kw("EXTENT"), optional($.__parameter_extent_size)),
  __parameter_extent_size: ($) =>
    choice(
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.identifier,
    ),
  __parameter_format_option: ($) => seq(kw("FORMAT"), $.string_literal),
  __parameter_initial_option: ($) =>
    seq(
      choice(kw("INITIAL"), alias(token(seq(/INIT(IAL)?/i, /\s+/)), "INITIAL")),
      choice($._expression, seq("[", optional($._expression), "]")),
    ),
  __parameter_label_option: ($) =>
    seq(kw("LABEL"), $.string_literal, repeat(seq(",", $.string_literal))),
  __parameter_no_undo: ($) => tkw("NO-UNDO"),
  __parameter_field_name: ($) => choice($.qualified_name, $.identifier),
});
