export default ({ kw }) => ({
  create_temp_table_statement: ($) => seq($._kw_create, $.__create_temp_table_body, $._terminator),

  __create_temp_table_body: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("TEMP-TABLE"),
      field("handle", $._identifier_or_access),
      optional(alias($._in_widget_pool, $.in_widget_pool_phrase)),
    ),
});
