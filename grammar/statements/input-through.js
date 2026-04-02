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
    seq($.__input_through_program_target, optional($.__input_through_tail)),
  __input_through_tail: ($) =>
    choice(
      seq(repeat1($.__input_through_argument), optional($.__input_through_tail_after_arguments)),
      seq($.__input_through_echo, optional($.__input_through_tail_after_echo)),
      seq($.__input_through_map, optional($.__input_through_tail_after_map)),
      $.__input_through_unbuffered_convert_tail,
    ),
  __input_through_tail_after_arguments: ($) =>
    choice(
      seq($.__input_through_echo, optional($.__input_through_tail_after_echo)),
      seq($.__input_through_map, optional($.__input_through_tail_after_map)),
      $.__input_through_unbuffered_convert_tail,
    ),
  __input_through_tail_after_echo: ($) =>
    choice(
      seq($.__input_through_map, optional($.__input_through_tail_after_map)),
      $.__input_through_unbuffered_convert_tail,
    ),
  __input_through_tail_after_map: ($) => $.__input_through_unbuffered_convert_tail,
  __input_through_unbuffered_convert_tail: ($) =>
    choice(
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($.__input_through_convert_phrase, $.convert_phrase)),
      ),
      alias($.__input_through_convert_phrase, $.convert_phrase),
    ),
  __input_through_echo: ($) => choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo)),
  __input_through_map: ($) =>
    choice(
      seq(kw("MAP"), field("map", $._identifier_or_string_literal)),
      alias(kw("NO-MAP"), $.no_map),
    ),

  __input_through_program_target: ($) =>
    choice(field("program", $.identifier), field("program", $.string_literal), $._value_expression),
  __input_through_argument: ($) => choice($.__input_through_arg_value, $._value_expression),
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
