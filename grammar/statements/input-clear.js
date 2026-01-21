module.exports = ({ kw }) => ({
  input_clear_statement: ($) =>
    seq(kw("INPUT"), token(/CLEAR/i), $._terminator),
});
