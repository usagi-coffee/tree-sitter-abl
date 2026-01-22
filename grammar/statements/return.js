module.exports = ({ kw, tkw }) => ({
  return_statement: ($) =>
    choice(
      seq(tkw("RETURN"), $._terminator),
      seq(kw("RETURN"), $._expression, $._terminator),
    ),
});
