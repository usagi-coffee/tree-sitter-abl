export default ({ kw }) => ({
  use_statement: ($) => seq($.__use_prefix, $._no_error_terminator),

  __use_prefix: ($) => seq(kw("USE"), field("environment", $._expression)),
});
