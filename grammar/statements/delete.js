export default ({ kw }) => ({
  delete_statement: ($) => seq($.__delete_body, $._no_error_terminator),

  __delete_body: ($) =>
    seq(
      kw("DELETE"),
      field("record", $._identifier_or_qualified_name),
      optional($._format_validate),
    ),

  delete_object_statement: ($) => seq($.__delete_object_prefix, $._no_error_terminator),

  __delete_object_prefix: ($) =>
    seq(
      kw("DELETE"),
      kw("OBJECT"),
      field(
        "name",
        choice(
          $._identifier_or_array_access,
          $.system_handle_identifier,
          $.object_access,
          // A member reached with `::`, as in `DELETE OBJECT pBufTT::Liste.`
          $.scoped_name,
          $.parenthesized_expression,
          // A handle produced by a call rather than named outright:
          // `DELETE OBJECT WIDGET-HANDLE (ENTRY (i, listeHe)).` and
          // `DELETE OBJECT h:BUFFER-FIELD("nom").` both compile. The list above
          // had grown as far as the attribute and stopped there, so a handle
          // that comes back from a function or a method had no reading --
          // while DELETE PROCEDURE and DELETE WIDGET, which take a full
          // expression, accepted the same text.
          $.function_call,
        ),
      ),
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
