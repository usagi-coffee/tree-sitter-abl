module.exports = ({ kw }) => ({
  save_cache_statement: ($) =>
    seq(kw("SAVE"), kw("CACHE"), $.__save_cache_body, $._terminator),

  __save_cache_body: ($) =>
    seq(
      choice(kw("CURRENT"), kw("COMPLETE")),
      choice(
        field("database", $.identifier),
        seq(kw("VALUE"), "(", field("database", $._expression), ")"),
      ),
      kw("TO"),
      choice(
        field("path", $.string_literal),
        seq(kw("VALUE"), "(", field("path", $._expression), ")"),
      ),
      optional(kw("NO-ERROR")),
    ),
});
