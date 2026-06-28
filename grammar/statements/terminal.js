module.exports = ({ kw }) => ({
  terminal_statement: ($) => seq($.__terminal_prefix, $._terminator),

  __terminal_prefix: ($) => seq(kw("TERMINAL"), $.__terminal_body),
  __terminal_body: ($) => seq("=", field("terminal", $._expression)),
});
