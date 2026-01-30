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
      alias($.constant_expression, $.constant),
      $.parenthesized_expression,
      $.available_expression,
      $.can_find_expression,
      $.current_changed_expression,
      $.ambiguous_expression,
      $.accum_expression,
      $.locked_expression,
      $.object_access_expression,
      $.new_expression,
      $.dataset_reference,
      $.function_call,
      $.array_access,
      $.scoped_name,
      $.qualified_name,
      $.object_access,
      $.argument_reference,
      $.identifier,
      $.number_literal,
      $.date_literal,
      $.string_literal,
      $.boolean_literal,
      $.null_literal,
      $.in_frame_expression,
      $.input_expression,

      $.__widget_keywords,
      prec(-1, $.widget_access),
    ),
});
