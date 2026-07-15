export default ({ kw }) => ({
  accum_expression: ($) =>
    seq(
      $.__accum_prefix,
      field("operation", $.__accum_aggregate),
      field("field", $.__accum_expression),
    ),

  __accum_prefix: ($) => kw("ACCUM"),
  __accum_aggregate: ($) => $.aggregate_phrase,
  __accum_expression: ($) => $._expression,
});
