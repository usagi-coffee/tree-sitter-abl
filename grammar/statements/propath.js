export default ({ kw }) => ({
  propath_statement: ($) => seq($.__propath_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice-sequence
  __propath_prefix: ($) => seq($._kw_propath, choice("=", "+="), field("value", $._expression)),
});
