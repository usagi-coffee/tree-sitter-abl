export default ({ kw }) => ({
  input_through_statement: ($) =>
    seq($.__input_through_prefix, $.__input_through_body, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __input_through_prefix: ($) => seq($._input_stream_prefix, $._kw_through),
  __input_through_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._program_target,
      optional($.__input_through_args),
      optional($._echo_map_unbuffered_convert_tail),
    ),

  __input_through_args: ($) =>
    prec.right(
      seq(
        choice($.__input_through_arg_value, $._value_expression),
        optional($.__input_through_args),
      ),
    ),

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
