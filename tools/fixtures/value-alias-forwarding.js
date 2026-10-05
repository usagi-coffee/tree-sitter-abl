export default grammar({
  inline: ($) => [],
  rules: {
    _value_expression: ($) => seq($._value_expression_opener, ")"),
    _aliased_value_expression: ($) => alias($._value_expression, $.value_expression),
    _run_target: ($) => choice($._aliased_value_expression, $.procedure_name),
    __persistent_trigger_procedure: ($) =>
      choice($._qualified_identifier, $.string_literal, $._aliased_value_expression),
  },
});
