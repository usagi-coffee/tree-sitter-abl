export default ({ kw }) => ({
  accum_expression: ($) => seq($.__accum_head, field("field", $._expression)),

  __accum_head: ($) => seq(kw("ACCUM"), field("operation", $.aggregate_phrase)),
});
