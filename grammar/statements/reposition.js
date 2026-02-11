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
          optional(alias(kw("NO-ERROR"), $.no_error)),
        ),
        seq(
          kw("TO"),
          kw("RECID"),
          field("recid", $._expression),
          optional(alias(kw("NO-ERROR"), $.no_error)),
        ),
        seq(kw("TO"), kw("ROW"), field("row", $._expression)),
        seq(alias(kw("FORWARDS"), $.forwards), field("count", $._expression)),
        seq(alias(kw("BACKWARDS"), $.backwards), field("count", $._expression)),
      ),
    ),
});
