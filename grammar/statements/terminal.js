module.exports = ({ kw }) => ({
  terminal_statement: ($) =>
    seq(kw("TERMINAL"), $.__terminal_body, $._terminator),

  __terminal_body: ($) => seq("=", field("terminal", $._expression)),
});
