module.exports = ({ kw, tkw }) => ({
  super_statement: ($) =>
    prec(1, seq(
      tkw("SUPER"),
      $.argument_list,
      $._terminator,
    )),
});
