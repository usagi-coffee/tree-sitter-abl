module.exports = ({ kw, tkw }) => ({
  delete_statement: ($) => seq(kw("DELETE"), $.__delete_body, $._terminator),

  __delete_body: ($) =>
    seq(
      field("record", $.__delete_record_name),
      optional(alias($.__delete_validate_phrase, $.validate_option)),
      optional($.__delete_no_error),
    ),

  delete_object_statement: ($) =>
    seq(kw("DELETE"), kw("OBJECT"), $.__delete_object_body, $._terminator),

  __delete_object_body: ($) =>
    seq(field("name", $.identifier), optional($.__delete_no_error)),

  __delete_validate_phrase: ($) =>
    seq(tkw("VALIDATE"), "(", $._expression, ",", $._expression, ")"),
  __delete_no_error: ($) => tkw("NO-ERROR"),
  __delete_record_name: ($) => choice($.identifier, $.qualified_name),
});
