export default ({ kw }) => ({
  terminal_statement: ($) => seq($.__terminal_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __terminal_prefix: ($) => seq(kw("TERMINAL"), "=", field("terminal", $._expression)),
});
