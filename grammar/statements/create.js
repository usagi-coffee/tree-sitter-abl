module.exports = ({ kw, tkw }) => ({
  create_statement: ($) =>
    seq(
      kw("CREATE"),
      field("table", $.__create_record_name),
      optional($.__create_no_error),
      $._terminator,
    ),
  __create_no_error: ($) => tkw("NO-ERROR"),
  __create_record_name: ($) => choice($.identifier, $.qualified_name),
});
