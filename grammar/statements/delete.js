export default ({ kw }) => ({
  delete_statement: ($) => seq(kw("DELETE"), $.__delete_body, $._no_error_terminator),

  __delete_body: ($) =>
    seq(field("record", $._identifier_or_qualified_name), optional($._format_validate)),

  delete_object_statement: ($) => seq($.__delete_object_prefix, $._no_error_terminator),

  __delete_object_prefix: ($) =>
    seq(
      kw("DELETE"),
      kw("OBJECT"),
      field("name", choice($.identifier, $.parenthesized_expression)),
    ),

  delete_procedure_statement: ($) => seq($.__delete_procedure_prefix, $._no_error_terminator),

  __delete_procedure_prefix: ($) =>
    seq(kw("DELETE"), kw("PROCEDURE", { offset: 4 }), field("handle", $._expression)),

  delete_widget_statement: ($) => seq($.__delete_widget_prefix, $._no_error_terminator),

  __delete_widget_prefix: ($) =>
    seq(
      kw("DELETE"),
      kw("WIDGET"),
      field("widget", $._expression),
      repeat(seq(",", field("widget", $._expression))),
    ),
});
