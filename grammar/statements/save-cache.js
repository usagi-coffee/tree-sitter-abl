module.exports = ({ kw }) => ({
  save_cache_statement: ($) =>
    seq(kw("SAVE"), kw("CACHE"), $.__save_cache_body, $._no_error_terminator),

  __save_cache_body: ($) =>
    seq(
      choice(kw("CURRENT"), kw("COMPLETE")),
      choice(field("database", $.identifier), field("database", $.__save_cache_value_expression)),
      kw("TO"),
      choice(field("path", $.string_literal), field("path", $.__save_cache_value_expression)),
    ),
  __save_cache_value_expression: ($) => seq(kw("VALUE"), "(", $._expression, ")"),
});
