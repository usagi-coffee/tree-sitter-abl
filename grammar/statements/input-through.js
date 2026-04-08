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
  __input_through_unbuffered_convert_tail: ($) => $.__input_unbuffered_convert_tail,
  __input_through_echo: ($) => $.__input_echo,
  __input_through_map: ($) =>
    choice(seq(kw("MAP"), field("map", $.__input_map_entry)), alias(kw("NO-MAP"), $.no_map)),

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
});
