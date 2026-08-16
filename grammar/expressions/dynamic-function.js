export default ({ kw }) => ({
  // DYNAMIC-FUNCTION ( function-name [ IN proc-handle ] [ , parameter ]... )
  //
  // The IN clause inside the parentheses is what sets this apart from a plain
  // call, and it is why the generic function_call rule could not carry it.
  dynamic_function_call: ($) =>
    seq(
      kw("DYNAMIC-FUNCTION"),
      "(",
      field("function", $.__dynamic_function_name),
      optional(seq(kw("IN"), field("context", $.__dynamic_function_context))),
      repeat(seq(",", field("argument", $.argument))),
      ")",
    ),

  // Spelled out rather than reusing the expression rule: that one reaches
  // widget_qualified_name, whose separator is IN, and it would then swallow the
  // IN clause that follows.
  __dynamic_function_name: ($) =>
    choice(
      $.__dynamic_function_atom,
      alias($.__dynamic_function_concatenation, $.binary_expression),
    ),
  __dynamic_function_concatenation: ($) =>
    seq($.__dynamic_function_atom, repeat1(seq("+", $.__dynamic_function_atom))),
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
