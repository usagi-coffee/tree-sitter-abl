module.exports = ({ kw }) => ({
  query_tuning_phrase: ($) =>
    seq(
      kw("QUERY-TUNING"),
      "(",
      repeat1(
        choice(
          kw("ARRAY-MESSAGE"),
          kw("NO-ARRAY-MESSAGE"),
          kw("BIND-WHERE"),
          kw("NO-BIND-WHERE"),
          seq(
            kw("CACHE-SIZE"),
            field("cache_size", $.number_literal),
            optional(choice(kw("ROW"), kw("BYTE"))),
          ),
          seq(
            kw("DEBUG"),
            choice(
              kw("SQL"),
              seq(kw("EXTENDED"), optional($.__query_tuning_diag_option)),
            ),
          ),
          kw("NO-DEBUG"),
          kw("INDEX-HINT"),
          kw("NO-INDEX-HINT"),
          kw("JOIN-BY-SQLDB"),
          kw("NO-JOIN-BY-SQLDB"),
          kw("LOOKAHEAD"),
          kw("NO-LOOKAHEAD"),
          kw("ORDERED-JOIN"),
          kw("REVERSE-FROM"),
          kw("SEPARATE-CONNECTION"),
          kw("NO-SEPARATE-CONNECTION"),
        ),
      ),
      ")",
    ),

  __query_tuning_diag_option: ($) =>
    choice(kw("CURSOR"), kw("DATA-BIND"), kw("PERFORMANCE"), kw("VERBOSE")),
});
