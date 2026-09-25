export default ({ kw }) => ({
  save_cache_statement: ($) => seq($.__save_cache_prefix, $._no_error_terminator),

  __save_cache_prefix: ($) =>
    seq(
      kw("SAVE"),
      $._kw_cache,
      choice($._kw_current, kw("COMPLETE")),
      choice(field("database", $.identifier), field("database", $.__save_cache_value_expression)),
      $._to_keyword,
      choice(field("path", $.string_literal), field("path", $.__save_cache_value_expression)),
    ),
  __save_cache_value_expression: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
    seq($._kw_value, $._parenthesized_expression_prefix, ")"),
});
