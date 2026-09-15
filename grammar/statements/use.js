export default ({ kw }) => ({
  use_statement: ($) => seq($.__use_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __use_prefix: ($) => seq(kw("USE"), field("environment", $._expression)),
});
