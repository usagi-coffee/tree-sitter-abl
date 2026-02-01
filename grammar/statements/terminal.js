module.exports = ({ kw }) => ({
  terminal_statement: ($) =>
    seq(kw("TERMINAL"), "=", field("terminal", $._expression), $._terminator),
});
