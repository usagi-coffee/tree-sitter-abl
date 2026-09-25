export default ({ kw }) => ({
  down_statement: ($) => seq($.__down_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __down_prefix: ($) => seq($._kw_down, optional($._up_down_tail)),
});
