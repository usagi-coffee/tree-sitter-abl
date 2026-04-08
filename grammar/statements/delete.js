module.exports = ({ kw }) => ({
  delete_statement: ($) => seq(kw("DELETE"), $.__delete_body, $._no_error_terminator),

  __delete_body: ($) =>
    seq(field("record", $._identifier_or_qualified_name), optional($._format_validate)),

  delete_object_statement: ($) =>
    seq(kw("DELETE"), kw("OBJECT"), $.__delete_object_body, $._no_error_terminator),

  delete_procedure_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("PROCEDURE", { offset: 4 }),
      field("handle", $._expression),
      $._no_error_terminator,
    ),

  delete_widget_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("WIDGET"),
      field("widget", $._expression),
      repeat(seq(",", field("widget", $._expression))),
      $._no_error_terminator,
    ),

  __delete_object_body: ($) => seq(field("name", $.identifier)),
});
