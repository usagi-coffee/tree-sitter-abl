module.exports = ({ kw }) => ({
  input_through_statement: ($) =>
    seq(
      kw("INPUT"),
      optional($._stream_phrase),
      kw("THROUGH"),
      $.__input_through_body,
      $._terminator,
    ),

  __input_through_body: ($) =>
    seq(
      $.__input_through_program_target,
      repeat($.__input_through_argument),
      optional(choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo))),
      optional(
        choice(
          seq(kw("MAP"), field("map", choice($.identifier, $.string_literal))),
          alias(kw("NO-MAP"), $.no_map),
        ),
      ),
      optional(alias(kw("UNBUFFERED"), $.unbuffered)),
      optional(alias($.__input_through_convert_phrase, $.convert_phrase)),
    ),

  __input_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
    ),
  __input_through_argument: ($) =>
    choice(
      $.__input_through_arg_value,
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
    ),
  __input_through_arg_value: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      prec(1, $.function_call),
      $.object_access,
      $._identifier_or_qualified_name,
      $.preprocessor_name,
      alias($.__input_through_shell_variable, $.shell_variable),
    ),
  __input_through_shell_variable: ($) => token(/\$+[A-Za-z_0-9]*/),
  __input_through_convert_phrase: ($) =>
    choice(
      alias(kw("NO-CONVERT"), $.no_convert),
      seq(
        kw("CONVERT"),
        optional(seq(kw("TARGET"), field("target", $.string_literal))),
        optional(seq(kw("SOURCE"), field("source", $.string_literal))),
      ),
    ),
});
