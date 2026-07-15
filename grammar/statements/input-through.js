export default ({ kw }) => ({
  input_through_statement: ($) =>
    seq($.__input_through_prefix, $.__input_through_body, $._terminator),

  __input_through_prefix: ($) => seq($._input_stream_prefix, kw("THROUGH")),
  __input_through_body: ($) => seq($._program_target, optional($.__input_through_tail)),
  __input_through_tail: ($) =>
    choice(
      seq(repeat1($.__input_through_argument), optional($._echo_map_unbuffered_convert_tail)),
      $._echo_map_unbuffered_convert_tail,
    ),

  __input_through_argument: ($) => choice($.__input_through_arg_value, $._value_expression),
  __input_through_arg_value: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.function_call,
      $.object_access,
      $._identifier_or_qualified_name,
      $.preprocessor_name,
      alias($.__input_through_shell_variable, $.shell_variable),
    ),
  __input_through_shell_variable: ($) => token(/\$+[A-Za-z_0-9]*/),
});
