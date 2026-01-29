module.exports = ({ kw, tkw }) => ({
  empty_temp_table_statement: ($) =>
    seq(
      kw("EMPTY"),
      kw("TEMP-TABLE"),
      field("name", $.identifier),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
