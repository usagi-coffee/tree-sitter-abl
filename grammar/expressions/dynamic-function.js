export default ({ kw }) => ({
  dynamic_function_call: ($) => seq($.__dynamic_function_prefix, ")"),
  __dynamic_function_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("DYNAMIC-FUNCTION"),
      "(",
      field(
        "function",
        choice(
          $.__dynamic_function_atom,
          alias($.__dynamic_function_concatenation, $.binary_expression),
        ),
      ),
      optional(
        seq(
          $._in_keyword,
          field(
            "context",
            choice(
              $.system_handle_identifier,
              $.object_access,
              $.array_access,
              $.parenthesized_expression,
              $._qualified_identifier,
            ),
          ),
        ),
      ),
      optional($.__dynamic_function_arguments_tail),
    ),

  __dynamic_function_arguments_tail: ($) =>
    seq(",", field("argument", $.argument), optional($.__dynamic_function_arguments_tail)),

  __dynamic_function_concatenation: ($) =>
    seq($.__dynamic_function_atom, $.__dynamic_function_concatenation_tail),
  __dynamic_function_concatenation_tail: ($) =>
    seq("+", $.__dynamic_function_atom, optional($.__dynamic_function_concatenation_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/multi-use-private-choice-inline
  __dynamic_function_atom: ($) =>
    choice($._string_or_identifier_access_or_call, $.parenthesized_expression),
});
