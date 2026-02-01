module.exports = ({ kw }) => ({
  empty_temp_table_statement: ($) =>
    seq(kw("EMPTY"), $.__empty_temp_table_body, $._terminator),

  __empty_temp_table_body: ($) =>
    seq(
      kw("TEMP-TABLE"),
      field("name", $.identifier),
      optional(kw("NO-ERROR")),
    ),
});
