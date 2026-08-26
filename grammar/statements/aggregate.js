export default ({ kw }) => ({
  aggregate_statement: ($) => seq($.__aggregate_prefix, $._terminator),

  __aggregate_prefix: ($) =>
    seq(
      kw("AGGREGATE"),
      $.__aggregate_items,
      $._for_keyword,
      field("table", $._identifier_or_qualified_name),
      optional(alias($.__aggregate_where_phrase, $.where_phrase)),
    ),
  __aggregate_operation: ($) =>
    choice(kw("COUNT"), kw("TOTAL"), kw("AVERAGE"), kw("MAXIMUM"), kw("MINIMUM")),
  __aggregate_items: ($) =>
    prec.right(
      seq(
        field("target", $._expression),
        "=",
        $.__aggregate_operation,
        "(",
        field("field", $._expression),
        ")",
        optional($.__aggregate_items),
      ),
    ),
  __aggregate_where_phrase: ($) => seq(kw("WHERE"), field("condition", $._expression)),
});
