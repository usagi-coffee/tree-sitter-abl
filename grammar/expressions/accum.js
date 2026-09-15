export default ({ kw }) => ({
  accum_expression: ($) => seq($.__accum_head, field("field", $._expression)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __accum_head: ($) => seq(kw("ACCUM"), field("operation", $.aggregate_phrase)),
});
