module.exports = ({ kw }) => ({
  create_statement: ($) =>
    seq(kw("CREATE"), field("table", $.__create_record_name), $._terminator),
  __create_record_name: ($) => choice($.identifier, $.qualified_name),
});
