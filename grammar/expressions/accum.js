module.exports = ({ kw }) => ({
  accum_expression: ($) => seq(kw("ACCUM"), $.__accum_expression_body),

  __accum_expression_body: ($) =>
    seq(
      field("operation", repeat1($.__accum_aggregate)),
      field("field", $.__accum_expression),
    ),

  __accum_aggregate: ($) => $.aggregate_phrase,
  __accum_expression: ($) => $._expression,
});
