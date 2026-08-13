export default ({ kw }) => ({
  terminal_statement: ($) => seq($.__terminal_prefix, $._terminator),

  __terminal_prefix: ($) => seq(kw("TERMINAL"), "=", field("terminal", $._expression)),
});
