module.exports = ({ kw }) => ({
  reposition_statement: ($) => seq($.__reposition_prefix, $._terminator),

  __reposition_prefix: ($) => seq(kw("REPOSITION"), $.__reposition_body),
  __reposition_body: ($) =>
    seq(
      field("query", $.identifier),
      choice(
        seq(
          kw("TO"),
          kw("ROWID"),
          field("rowid", $._expression),
          repeat(seq(",", field("rowid", $._expression))),
          optional(seq(kw("FOR"), kw("TENANT"), field("tenant", $._expression))),
          optional($.__no_error),
        ),
        seq(
          kw("TO"),
          kw("RECID"),
          field("recid", $._expression),
          optional($.__no_error),
        ),
        seq(kw("TO"), kw("ROW"), field("row", $._expression)),
        seq(
          alias(kw("FORWARDS", { alias: "FORWARD", offset: 7 }), $.forwards),
          field("count", $._expression),
        ),
        seq(
          alias(kw("BACKWARDS", { alias: "BACKWARD", offset: 8 }), $.backwards),
          field("count", $._expression),
        ),
      ),
    ),
});
