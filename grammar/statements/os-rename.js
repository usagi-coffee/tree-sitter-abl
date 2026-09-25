export default ({ kw }) => ({
  os_rename_statement: ($) => seq($.__os_rename_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __os_rename_prefix: ($) =>
    seq(kw("OS-RENAME"), field("source", $._text_operand), field("target", $._text_operand)),
});
