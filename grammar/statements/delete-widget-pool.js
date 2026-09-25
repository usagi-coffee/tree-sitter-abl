export default ({ kw }) => ({
  delete_widget_pool_statement: ($) => seq($.__delete_widget_pool_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __delete_widget_pool_prefix: ($) =>
    seq(
      $._delete_keyword,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("WIDGET-POOL"),
      optional(field("pool", $._identifier_or_string_literal)),
    ),
});
