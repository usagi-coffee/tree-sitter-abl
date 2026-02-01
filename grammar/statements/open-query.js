module.exports = ({ kw }) => ({
  open_query_statement: ($) =>
    seq(
      kw("OPEN"),
      kw("QUERY"),
      field("query", $.identifier),
      $.__open_query_body,
      $._terminator,
    ),
  __open_query_body: ($) =>
    choice(
      seq(
        choice(kw("FOR"), kw("PRESELECT")),
        kw("EACH"),
        alias($.__open_query_record_phrase, $.record_phrase),
        repeat(
          seq(
            ",",
            choice(kw("EACH"), kw("FIRST"), kw("LAST")),
            alias($.__open_query_record_phrase, $.record_phrase),
          ),
        ),
        optional(alias($.__open_query_tuning, $.query_tuning)),
        kw("BREAK"),
        repeat(alias($.__open_query_by_phrase, $.by_phrase)),
        optional(
          field(
            "lock",
            choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
          ),
        ),
        optional(kw("INDEXED-REPOSITION")),
        optional(seq(kw("MAX-ROWS"), field("max_rows", $._expression))),
      ),
      seq(
        choice(kw("FOR"), kw("PRESELECT")),
        kw("EACH"),
        alias($.__open_query_record_phrase, $.record_phrase),
        repeat(
          seq(
            ",",
            choice(kw("EACH"), kw("FIRST"), kw("LAST")),
            alias($.__open_query_record_phrase, $.record_phrase),
          ),
        ),
        optional(alias($.__open_query_tuning, $.query_tuning)),
        repeat(alias($.__open_query_by_phrase, $.by_phrase)),
        optional(kw("INDEXED-REPOSITION")),
        optional(seq(kw("MAX-ROWS"), field("max_rows", $._expression))),
      ),
    ),
  __open_query_record_phrase: ($) =>
    seq(
      field("record", choice($.identifier, $.qualified_name)),
      optional(
        seq(kw("OF"), field("of", choice($.identifier, $.qualified_name))),
      ),
      optional(seq(kw("WHERE"), field("where", $._expression))),
      optional(seq(kw("USE-INDEX"), field("index", $.identifier))),
      optional(
        field(
          "lock",
          choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
        ),
      ),
    ),
  __open_query_tuning: ($) =>
    seq(
      kw("QUERY-TUNING"),
      "(",
      repeat1(
        choice(
          seq(kw("LOOKAHEAD"), optional(seq(kw("CACHE-SIZE"), $._expression))),
          kw("NO-LOOKAHEAD"),
          seq(kw("DEBUG"), choice(kw("SQL"), kw("EXTENDED"))),
          kw("NO-DEBUG"),
          kw("SEPARATE-CONNECTION"),
          kw("NO-SEPARATE-CONNECTION"),
          kw("JOIN-BY-SQLDB"),
          kw("NO-JOIN-BY-SQLDB"),
          kw("BIND-WHERE"),
          kw("NO-BIND-WHERE"),
        ),
      ),
      ")",
    ),
  __open_query_by_phrase: ($) =>
    seq(kw("BY"), field("by", $._expression), optional(kw("DESCENDING"))),
});
