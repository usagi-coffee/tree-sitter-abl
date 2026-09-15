export default ({ kw }) => ({
  down_statement: ($) => seq($.__down_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __down_prefix: ($) => seq(kw("DOWN"), optional($._up_down_tail)),
});
