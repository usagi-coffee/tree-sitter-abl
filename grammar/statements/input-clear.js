module.exports = ({ kw, tkw }) => ({
  input_clear_statement: ($) =>
    seq(kw("INPUT"), tkw("CLEAR"), $._terminator),
});
