module.exports = ({ kw, tkw }) => ({
  reposition_statement: ($) =>
    seq(tkw("REPOSITION"), $.__reposition_body, $._terminator),

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
          optional(tkw("NO-ERROR")),
        ),
        seq(
          kw("TO"),
          kw("RECID"),
          field("recid", $._expression),
          optional(tkw("NO-ERROR")),
        ),
        seq(kw("TO"), kw("ROW"), field("row", $._expression)),
        seq(tkw("FORWARDS"), field("count", $._expression)),
        seq(tkw("BACKWARDS"), field("count", $._expression)),
      ),
    ),
});
