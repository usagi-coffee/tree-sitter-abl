export default ({ kw }) => ({
  up_statement: ($) => seq($.__up_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __up_prefix: ($) => seq($._kw_up, optional($._up_down_tail)),
});
