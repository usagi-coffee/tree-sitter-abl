module.exports = ({ kw }) => ({
  delete_statement: ($) => seq(kw("DELETE"), $.__delete_body, $._terminator),

  __delete_body: ($) =>
    seq(
      field("record", $.__delete_record_name),
      optional(alias($.__delete_validate_phrase, $.validate_option)),
      optional($.__delete_no_error),
    ),

  delete_object_statement: ($) =>
    seq(kw("DELETE"), kw("OBJECT"), $.__delete_object_body, $._terminator),

  delete_procedure_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("PROCEDURE"),
      field("handle", $._expression),
      optional($.__delete_no_error),
      $._terminator,
    ),

  delete_widget_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("WIDGET"),
      field("widget", $._expression),
      repeat(seq(",", field("widget", $._expression))),
      optional($.__delete_no_error),
      $._terminator,
    ),

  __delete_object_body: ($) =>
    seq(field("name", $.identifier), optional($.__delete_no_error)),

  __delete_validate_phrase: ($) =>
    seq(kw("VALIDATE"), "(", $._expression, ",", $._expression, ")"),
  __delete_no_error: ($) => kw("NO-ERROR"),
  __delete_record_name: ($) => choice($.identifier, $.qualified_name),
});
