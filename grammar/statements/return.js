module.exports = ({ kw }) => ({
  return_statement: ($) =>
    choice(
      seq(token(/RETURN[.;]/i)),
      seq(kw("RETURN"), $._expression, $._terminator),
      seq(kw("RETURN"), $._terminator),
    ),
});
