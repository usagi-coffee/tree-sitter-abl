module.exports = ({ kw }) => ({
  open_query_statement: ($) =>
    seq(kw("OPEN"), $.__open_query_body, $._terminator),

  __open_query_body: ($) =>
    seq(
      kw("QUERY"),
      field("query", $.identifier),
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
      optional($.query_tuning_phrase),
      optional(kw("BREAK")),
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

  __open_query_record_phrase: ($) =>
    prec.right(
      seq(
        field("record", $._identifier_or_qualified_name),
        repeat($.__open_query_record_option),
      ),
    ),
  __open_query_record_option: ($) =>
    choice(
      seq(kw("OF"), field("of", $._identifier_or_qualified_name)),
      seq(kw("WHERE"), field("where", $._expression)),
      seq(kw("USE-INDEX"), field("index", $.identifier)),
      field(
        "lock",
        choice(kw("SHARE-LOCK"), kw("EXCLUSIVE-LOCK"), kw("NO-LOCK")),
      ),
    ),


  __open_query_by_phrase: ($) =>
    seq(
      kw("BY"),
      field("by", $._expression),
      optional(kw("DESCENDING", { offset: 4 })),
    ),
});
