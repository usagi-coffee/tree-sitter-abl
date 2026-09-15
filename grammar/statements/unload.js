export default ({ kw }) => ({
  unload_statement: ($) => seq($.__unload_prefix, $._no_error_terminator),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __unload_prefix: ($) => seq(kw("UNLOAD"), field("file", $._expression)),
});
