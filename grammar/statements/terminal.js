module.exports = ({ kw, tkw }) => ({
  terminal_statement: ($) =>
    seq(tkw("TERMINAL"), field("terminal", $._expression), $._terminator),
});
