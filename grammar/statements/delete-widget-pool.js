export default ({ kw }) => ({
  delete_widget_pool_statement: ($) => seq($.__delete_widget_pool_prefix, $._no_error_terminator),

  __delete_widget_pool_prefix: ($) =>
    seq(
      $._delete_keyword,
      kw("WIDGET-POOL"),
      optional(field("pool", $._identifier_or_string_literal)),
    ),
});
