export default ({ kw }) => ({
  save_cache_statement: ($) => seq($.__save_cache_prefix, $._no_error_terminator),

  __save_cache_prefix: ($) =>
    seq(
      kw("SAVE"),
      kw("CACHE"),
      choice(kw("CURRENT"), kw("COMPLETE")),
      choice(field("database", $.identifier), field("database", $.__save_cache_value_expression)),
      $._to_keyword,
      choice(field("path", $.string_literal), field("path", $.__save_cache_value_expression)),
    ),
  __save_cache_value_expression: ($) => seq($.__save_cache_value_prefix, ")"),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __save_cache_value_prefix: ($) => seq($._kw_value, $._parenthesized_expression_prefix),
});
