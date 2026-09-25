export default ({ kw }) => ({
  os_append_statement: ($) => seq($.__os_append_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __os_append_prefix: ($) =>
    seq(kw("OS-APPEND"), field("source", $._text_operand), field("target", $._text_operand)),
});
