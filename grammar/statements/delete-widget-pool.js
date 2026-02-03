module.exports = ({ kw }) => ({
  delete_widget_pool_statement: ($) =>
    seq(
      kw("DELETE"),
      kw("WIDGET-POOL"),
      optional(field("pool", $.identifier)),
      $._terminator,
    ),
});
