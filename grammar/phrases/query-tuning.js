module.exports = ({ kw }) => ({
  query_tuning_phrase: ($) =>
    seq(
      kw("QUERY-TUNING"),
      "(",
      repeat1(
        choice(
          alias(kw("ARRAY-MESSAGE"), $.array_message),
          alias(kw("NO-ARRAY-MESSAGE"), $.no_array_message),
          alias(kw("BIND-WHERE"), $.bind_where),
          alias(kw("NO-BIND-WHERE"), $.no_bind_where),
          seq(
            kw("CACHE-SIZE"),
            field("cache_size", $.number_literal),
            optional(choice(alias(kw("ROW"), $.row), alias(kw("BYTE"), $.byte))),
          ),
          seq(
            kw("DEBUG"),
            choice(
              alias(kw("SQL"), $.sql),
              seq(kw("EXTENDED"), optional($.__query_tuning_diag_option)),
            ),
          ),
          alias(kw("NO-DEBUG"), $.no_debug),
          alias(kw("INDEX-HINT"), $.index_hint),
          alias(kw("NO-INDEX-HINT"), $.no_index_hint),
          alias(kw("JOIN-BY-SQLDB"), $.join_by_sqldb),
          alias(kw("NO-JOIN-BY-SQLDB"), $.no_join_by_sqldb),
          alias(kw("LOOKAHEAD"), $.lookahead),
          alias(kw("NO-LOOKAHEAD"), $.no_lookahead),
          alias(kw("ORDERED-JOIN"), $.ordered_join),
          alias(kw("REVERSE-FROM"), $.reverse_from),
          alias(kw("SEPARATE-CONNECTION"), $.separate_connection),
          alias(kw("NO-SEPARATE-CONNECTION"), $.no_separate_connection),
        ),
      ),
      ")",
    ),

  __query_tuning_diag_option: ($) =>
    choice(
      alias(kw("CURSOR"), $.cursor),
      alias(kw("DATA-BIND"), $.data_bind),
      alias(kw("PERFORMANCE"), $.performance),
      alias(kw("VERBOSE"), $.verbose),
    ),
});
