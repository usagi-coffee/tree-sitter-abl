export default ({ kw }) => ({
  input_clear_statement: ($) => seq($.__input_clear_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __input_clear_prefix: ($) => seq($._kw_input, kw("CLEAR")),
});
