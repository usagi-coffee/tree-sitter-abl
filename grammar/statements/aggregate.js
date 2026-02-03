module.exports = ({ kw }) => ({
  aggregate_statement: ($) =>
    seq(kw("AGGREGATE"), $.__aggregate_body, $._terminator),

  __aggregate_body: ($) =>
    seq(
      repeat1($.__aggregate_assignment),
      kw("FOR"),
      field("table", $._identifier_or_qualified_name),
      optional(alias($.__aggregate_where_phrase, $.where_phrase)),
    ),

  __aggregate_assignment: ($) =>
    seq(
      field("target", $._expression),
      "=",
      $.__aggregate_operation,
      "(",
      field("field", $._expression),
      ")",
    ),
  __aggregate_operation: ($) =>
    choice(
      kw("COUNT"),
      kw("TOTAL"),
      kw("AVERAGE"),
      kw("MAXIMUM"),
      kw("MINIMUM"),
    ),
  __aggregate_where_phrase: ($) =>
    seq(kw("WHERE"), field("condition", $._expression)),
});
