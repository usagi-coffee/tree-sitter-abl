export default ({ kw }) => ({
  accum_expression: ($) =>
    seq(
      $.__accum_prefix,
      field("operation", $.aggregate_phrase),
      field("field", $.__accum_expression),
    ),

  __accum_prefix: ($) => kw("ACCUM"),
  __accum_expression: ($) => $._expression,
});
