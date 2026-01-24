module.exports = ({ kw, tkw }) => ({
  open_query_statement: ($) =>
    seq(
      tkw("OPEN"),
      kw("QUERY"),
      field("query", $.identifier),
      choice(kw("FOR"), tkw("PRESELECT")),
      alias($.__open_query_record_phrase, $.record_phrase),
      repeat(
        seq(
          ",",
          choice(tkw("EACH"), tkw("FIRST"), tkw("LAST")),
          alias($.__open_query_record_phrase, $.record_phrase),
        ),
      ),
      optional(alias($.__open_query_tuning, $.query_tuning)),
      optional(tkw("BREAK")),
      repeat(alias($.__open_query_by_phrase, $.by_phrase)),
      optional(tkw("INDEXED-REPOSITION")),
      optional(seq(kw("MAX-ROWS"), field("max_rows", $._expression))),
      $._terminator,
    ),
  __open_query_record_phrase: ($) =>
    seq(
      tkw("EACH"),
      field("record", choice($.identifier, $.qualified_name)),
      optional(
        field(
          "lock",
          choice(tkw("SHARE-LOCK"), tkw("EXCLUSIVE-LOCK"), tkw("NO-LOCK")),
        ),
      ),
      optional(
        seq(kw("OF"), field("of", choice($.identifier, $.qualified_name))),
      ),
      optional(seq(kw("WHERE"), field("where", $._expression))),
      optional(seq(kw("USE-INDEX"), field("index", $.identifier))),
    ),
  __open_query_tuning: ($) =>
    seq(
      kw("QUERY-TUNING"),
      "(",
      repeat1(
        choice(
          seq(tkw("LOOKAHEAD"), optional(seq(kw("CACHE-SIZE"), $._expression))),
          tkw("NO-LOOKAHEAD"),
          seq(kw("DEBUG"), choice(tkw("SQL"), tkw("EXTENDED"))),
          tkw("NO-DEBUG"),
          tkw("SEPARATE-CONNECTION"),
          tkw("NO-SEPARATE-CONNECTION"),
          tkw("JOIN-BY-SQLDB"),
          tkw("NO-JOIN-BY-SQLDB"),
          tkw("BIND-WHERE"),
          tkw("NO-BIND-WHERE"),
        ),
      ),
      ")",
    ),
  __open_query_by_phrase: ($) =>
    seq(kw("BY"), field("by", $._expression), optional(tkw("DESCENDING"))),
});
