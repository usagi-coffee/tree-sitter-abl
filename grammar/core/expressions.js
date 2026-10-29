export default ({ kw }) => ({
  _expression: ($) =>
    choice(
      $.conditional_expression,
      $.binary_expression,
      $.unary_expression,
      $._primary_expression,
    ),

  // Already listed in grammar.inline; this module only contains one of its callers.
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/inline-dispatcher-boundary, tree-sitter-optimize/single-use-shared-choice-inline
  _primary_expression: ($) =>
    choice(
      prec("preprocessor", $.if_preprocessor_directive),
      prec("macro", $.preprocessor_name),
      $._qualified_identifier,
      $.system_handle_identifier,
      $.widget_qualified_name,
      $.parenthesized_expression,
      $.available_expression,
      $.can_find_expression,
      $.current_changed_expression,
      $.ambiguous_expression,
      $.accum_expression,
      $.locked_expression,
      $.new_expression,
      $.entered_expression,
      $.dataset_reference,
      $.seek_expression,
      $.function_call,
      $.array_access,
      $.scoped_name,
      $.object_access,
      $.number_literal,
      $.date_literal,
      $.string_literal,
      $.boolean_literal,
      $.null_literal,
      $.input_expression,
      // oxlint-disable-next-line tree-sitter-optimize/forwarded-alias-reuse
      alias($.include_expression, $.include_file_reference),
    ),
});
