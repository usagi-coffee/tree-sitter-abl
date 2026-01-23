module.exports = (ctx) => {
  return {
    _expression: ($) =>
      choice(
        $.conditional_expression,
        $.binary_expression,
        $.unary_expression,
        $._primary_expression,
      ),

    _primary_expression: ($) =>
      choice(
        $.parenthesized_expression,
        $.available_expression,
        $.can_find_expression,
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
        $.constant,
      ),

    _expression_list: ($) =>
      seq($._expression, repeat(seq(",", $._expression))),

    // _statement_expression excludes `=` from comparison operators to disambiguate
    // assignment vs equality at the statement level. Without this, `x = 5.` could
    // parse as either assignment_statement or expression_statement (equality check).
    // By excluding `=` here, expression_statement cannot match `x = 5.`, forcing it
    // to parse as assignment_statement.
    _statement_expression: ($) =>
      choice(
        alias($.binary_expression_no_eq, $.binary_expression),
        $.conditional_expression,
        $.unary_expression,
        $._primary_expression,
      ),
  };
};
