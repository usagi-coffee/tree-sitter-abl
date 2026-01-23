module.exports = ({ kw, tkw }) => ({
  aggregate_statement: ($) =>
    seq(
      kw("AGGREGATE"),
      repeat1($.__aggregate_assignment),
      kw("FOR"),
      field("table", choice($.identifier, $.qualified_name)),
      optional(alias($.__aggregate_where_clause, $.where_clause)),
      $._terminator,
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
    choice(tkw("COUNT"), tkw("TOTAL"), tkw("AVERAGE"), tkw("MAXIMUM"), tkw("MINIMUM")),
  __aggregate_where_clause: ($) =>
    seq(kw("WHERE"), field("condition", $._expression)),
});
