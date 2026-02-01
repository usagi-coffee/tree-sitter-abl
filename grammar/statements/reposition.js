module.exports = ({ kw }) => ({
  reposition_statement: ($) =>
    seq(kw("REPOSITION"), $.__reposition_body, $._terminator),

  __reposition_body: ($) =>
    seq(
      field("query", $.identifier),
      choice(
        seq(
          kw("TO"),
          kw("ROWID"),
          field("rowid", $._expression),
          repeat(seq(",", field("rowid", $._expression))),
          optional(
            seq(kw("FOR"), kw("TENANT"), field("tenant", $._expression)),
          ),
          optional(kw("NO-ERROR")),
        ),
        seq(
          kw("TO"),
          kw("RECID"),
          field("recid", $._expression),
          optional(kw("NO-ERROR")),
        ),
        seq(kw("TO"), kw("ROW"), field("row", $._expression)),
        seq(kw("FORWARDS"), field("count", $._expression)),
        seq(kw("BACKWARDS"), field("count", $._expression)),
      ),
    ),
});
