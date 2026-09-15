export default ({ kw }) => ({
  delete_statement: ($) => seq($.__delete_body, $._no_error_terminator),

  __delete_body: ($) =>
    seq(
      $._delete_keyword,
      field("record", $._identifier_or_qualified_name),
      optional($._format_validate),
    ),

  delete_object_statement: ($) => seq($.__delete_object_prefix, $._no_error_terminator),

  __delete_object_prefix: ($) =>
    seq(
      $._delete_keyword,
      kw("OBJECT"),
      field(
        "name",
        choice(
          $._identifier_or_array_access,
          $.system_handle_identifier,
          $.object_access,
          $.scoped_name,
          $.parenthesized_expression,
          $.function_call,
        ),
      ),
    ),

  delete_procedure_statement: ($) => seq($.__delete_procedure_prefix, $._no_error_terminator),

  __delete_procedure_prefix: ($) =>
    seq($._delete_keyword, kw("PROCEDURE", { offset: 4 }), field("handle", $._expression)),

  delete_widget_statement: ($) => seq($.__delete_widget_prefix, $._no_error_terminator),

  __delete_widget_prefix: ($) => seq($._delete_keyword, kw("WIDGET"), $.__delete_widget_head),

  __delete_widget_head: ($) =>
    seq(field("widget", $._expression), optional($.__delete_widget_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/tail-extraction, tree-sitter-optimize/single-use-sequence
  __delete_widget_tail: ($) => seq(",", $.__delete_widget_head),
});
