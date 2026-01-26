module.exports = ({ kw, tkw }) => ({
  super_statement: ($) =>
    prec(1, seq(tkw("SUPER"), $.arguments, $._terminator)),
});
