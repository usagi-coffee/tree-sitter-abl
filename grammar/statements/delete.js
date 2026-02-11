module.exports = ({ kw }) => ({
  delete_statement: ($) => seq(kw("DELETE"), $.__delete_body, $._terminator),

  __delete_body: ($) =>
    seq(
      field("record", $.__delete_record_name),
      optional(
        seq(
          kw("VALIDATE"),
          "(",
          field("condition", $._expression),
          ",",
          field("message", $._expression),
          ")",
        ),
      ),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  delete_object_statement: ($) =>
    seq(kw("DELETE"), kw("OBJECT"), $.__delete_object_body, $._terminator),

  delete_procedure_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("PROCEDURE", { offset: 4 }),
      field("handle", $._expression),
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),

  delete_widget_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("WIDGET"),
      field("widget", $._expression),
      repeat(seq(",", field("widget", $._expression))),
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),

  __delete_object_body: ($) =>
    seq(field("name", $.identifier), optional(alias(kw("NO-ERROR"), $.no_error))),

  __delete_record_name: ($) => $._identifier_or_qualified_name,
});
