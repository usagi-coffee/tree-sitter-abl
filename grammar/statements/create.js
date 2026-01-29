module.exports = ({ kw, tkw }) => ({
  create_statement: ($) => seq(kw("CREATE"), $.__create_body, $._terminator),
  __create_body: ($) =>
    seq(field("table", $.__create_record_name), optional($.__create_no_error)),
  __create_no_error: ($) => tkw("NO-ERROR"),
  __create_record_name: ($) => choice($.identifier, $.qualified_name),
});
