module.exports = ({ kw, tkw }) => ({
  create_temp_table_statement: ($) =>
    seq(
      kw("CREATE"),
      tkw("TEMP-TABLE"),
      field("handle", $.identifier),
      optional(seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier))),
    ),
});
