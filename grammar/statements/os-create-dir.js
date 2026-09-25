export default ({ kw }) => ({
  os_create_dir_statement: ($) => seq($.__os_create_dir_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __os_create_dir_prefix: ($) => seq(kw("OS-CREATE-DIR"), $.__os_create_dir_directories),

  __os_create_dir_directories: ($) =>
    prec.right(seq(field("directory", $._text_operand), optional($.__os_create_dir_directories))),
});
