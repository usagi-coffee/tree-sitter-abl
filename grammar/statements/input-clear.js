module.exports = ({ kw }) => ({
  input_clear_statement: ($) => seq(kw("INPUT"), kw("CLEAR"), $._terminator),
});
