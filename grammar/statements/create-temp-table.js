module.exports = ({ kw }) => ({
  create_temp_table_statement: ($) =>
    seq(kw("CREATE"), $.__create_temp_table_body, $._terminator),

  __create_temp_table_body: ($) =>
    seq(
      kw("TEMP-TABLE"),
      field("handle", $.identifier),
      optional(seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier))),
    ),
});
