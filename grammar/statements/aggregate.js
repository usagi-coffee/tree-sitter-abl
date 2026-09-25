export default ({ kw }) => ({
  aggregate_statement: ($) => seq($.__aggregate_prefix, $._terminator),

  __aggregate_prefix: ($) =>
    seq(
      kw("AGGREGATE"),
      $.__aggregate_items,
      $._for_keyword,
      field("table", $._qualified_identifier),
      optional(alias($.__aggregate_where_phrase, $.where_phrase)),
    ),
  __aggregate_items: ($) =>
    prec.right(
      seq(
        field("target", $._expression),
        "=",
        choice($._kw_count, $._kw_total, $._kw_average, $._kw_maximum, $._kw_minimum),
        "(",
        field("field", $._expression),
        ")",
        optional($.__aggregate_items),
      ),
    ),
  __aggregate_where_phrase: ($) => seq($._kw_where, field("condition", $._expression)),
});
