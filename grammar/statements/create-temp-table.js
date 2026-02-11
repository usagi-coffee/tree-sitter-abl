module.exports = ({ kw }) => ({
  create_temp_table_statement: ($) =>
    seq(kw("CREATE"), $.__create_temp_table_body, $._terminator),

  __create_temp_table_body: ($) =>
    seq(
      kw("TEMP-TABLE"),
      field("handle", $.identifier),
      optional(
        alias(
          $.__create_temp_table_in_widget_pool_phrase,
          $.in_widget_pool_phrase,
        ),
      ),
    ),
  __create_temp_table_in_widget_pool_phrase: ($) =>
    seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier)),
});
