module.exports = ({ kw }) => ({
  create_temp_table_statement: ($) =>
    seq(
      kw("CREATE"),
      kw("TEMP-TABLE"),
      field("handle", $.identifier),
      optional(seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier))),
    ),
});
