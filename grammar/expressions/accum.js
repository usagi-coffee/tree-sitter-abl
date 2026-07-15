export default ({ kw }) => ({
  accum_expression: ($) => seq($.__accum_head, field("field", $.__accum_expression)),

  __accum_head: ($) => seq(kw("ACCUM"), field("operation", $.aggregate_phrase)),
  __accum_expression: ($) => $._expression,
});
