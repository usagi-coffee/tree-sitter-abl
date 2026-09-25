export default ({ kw }) => ({
  save_cache_statement: ($) => seq($.__save_cache_prefix, $._no_error_terminator),

  __save_cache_prefix: ($) =>
    seq(
      $._kw_save,
      $._kw_cache,
      // oxlint-disable-next-line tree-sitter-optimize/choice-product-extraction
      choice($._kw_current, kw("COMPLETE")),
      choice(field("database", $.identifier), field("database", $.__save_cache_value_expression)),
      $._to_keyword,
      choice(field("path", $.string_literal), field("path", $.__save_cache_value_expression)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  __save_cache_value_expression: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
    seq($._kw_value, $._parenthesized_expression_prefix, ")"),
});
