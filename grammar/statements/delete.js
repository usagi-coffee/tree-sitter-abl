module.exports = ({ kw, tkw }) => ({
  delete_statement: ($) =>
    seq(
      kw("DELETE"),
      field("record", $.__delete_record_name),
      optional(alias($.__delete_validate_phrase, $.validate_option)),
      optional($.__delete_no_error),
      $._terminator,
    ),
  delete_object_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("OBJECT"),
      field("name", $.identifier),
      optional($.__delete_no_error),
      $._terminator,
    ),

  __delete_validate_phrase: ($) =>
    seq(kw("VALIDATE"), "(", $._expression, ",", $._expression, ")"),
  __delete_no_error: ($) => tkw("NO-ERROR"),
  __delete_record_name: ($) => choice($.identifier, $.qualified_name),
});
