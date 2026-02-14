module.exports = ({ kw, ctx }) => ({
  _expression: ($) =>
    choice(
      $.conditional_expression,
      $.binary_expression,
      $.unary_expression,
      $._primary_expression,
    ),

  _primary_expression: ($) =>
    choice(
      prec(-2, alias($.preprocessor_expression_directive, $.preprocessor_directive)),
      prec(-1, alias($.constant_expression, $.preprocessor_reference)),
      $._identifier_or_qualified_name,
      $.widget_qualified_name,
      $.parenthesized_expression,
      $.available_expression,
      $.can_find_expression,
      $.current_changed_expression,
      $.ambiguous_expression,
      $.accum_expression,
      $.locked_expression,
      $.new_expression,
      $.dataset_reference,
      $.seek_expression,
      $.function_call,
      $.array_access,
      $.scoped_name,
      $.object_access,
      $.argument_reference,
      $.number_literal,
      $.date_literal,
      $.string_literal,
      $.boolean_literal,
      $.null_literal,
      $.input_expression,
      alias($.include_expression, $.include_reference),
    ),
});
