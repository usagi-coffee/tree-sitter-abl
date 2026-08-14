export default ({ kw }) => ({
  create_temp_table_statement: ($) => seq(kw("CREATE"), $.__create_temp_table_body, $._terminator),

  __create_temp_table_body: ($) =>
    seq(
      kw("TEMP-TABLE"),
      field("handle", choice($._identifier_or_array_access, $.object_access)),
      optional(alias($._in_widget_pool, $.in_widget_pool_phrase)),
    ),
});
