export default ({ kw }) => ({
  delete_widget_pool_statement: ($) => seq($.__delete_widget_pool_prefix, $._no_error_terminator),

  __delete_widget_pool_prefix: ($) =>
    seq(
      kw("DELETE"),
      kw("WIDGET-POOL"),
      optional(field("pool", choice($.identifier, $.string_literal))),
    ),
});
