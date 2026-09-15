export default ({ kw }) => ({
  load_picture_statement: ($) => seq($.__load_picture_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __load_picture_prefix: ($) => seq(kw("LOAD-PICTURE"), optional(field("image", $._expression))),
});
