export default ({ kw }) => ({
  dynamic_function_call: ($) => seq($.__dynamic_function_prefix, ")"),
  __dynamic_function_prefix: ($) =>
    seq(
      kw("DYNAMIC-FUNCTION"),
      "(",
      field("function", $.__dynamic_function_name),
      optional(seq(kw("IN"), field("context", $.__dynamic_function_context))),
      repeat(seq(",", field("argument", $.argument))),
    ),

  __dynamic_function_name: ($) =>
    choice(
      $.__dynamic_function_atom,
      alias($.__dynamic_function_concatenation, $.binary_expression),
    ),
  __dynamic_function_concatenation: ($) =>
    seq($.__dynamic_function_atom, $.__dynamic_function_concatenation_tail),
  __dynamic_function_concatenation_tail: ($) =>
    seq("+", $.__dynamic_function_atom, optional($.__dynamic_function_concatenation_tail)),
  __dynamic_function_atom: ($) =>
    choice($.string_literal, $._identifier_or_access_or_call, $.parenthesized_expression),
  __dynamic_function_context: ($) =>
    choice(
      $.system_handle_identifier,
      $.object_access,
      $.array_access,
      $.parenthesized_expression,
      $._identifier_or_qualified_name,
    ),
});
