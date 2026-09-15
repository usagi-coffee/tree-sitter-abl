export default ({ kw }) => ({
  promsgs_statement: ($) => seq($.__promsgs_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __promsgs_prefix: ($) => seq(kw("PROMSGS"), $._equals_value),
});
