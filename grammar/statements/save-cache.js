module.exports = ({ kw, tkw }) => ({
  save_cache_statement: ($) =>
    seq(kw("SAVE"), kw("CACHE"), $.__save_cache_body, $._terminator),

  __save_cache_body: ($) =>
    seq(
      choice(tkw("CURRENT"), tkw("COMPLETE")),
      choice(
        field("database", $.identifier),
        seq(tkw("VALUE"), "(", field("database", $._expression), ")"),
      ),
      kw("TO"),
      choice(
        field("path", $.string_literal),
        seq(tkw("VALUE"), "(", field("path", $._expression), ")"),
      ),
      optional(tkw("NO-ERROR")),
    ),
});
