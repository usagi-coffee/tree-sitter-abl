module.exports = ({ kw }) => ({
  empty_temp_table_statement: ($) =>
    seq(
      kw("EMPTY"),
      kw("TEMP-TABLE"),
      field("name", $.identifier),
      $._terminator,
    ),
});
