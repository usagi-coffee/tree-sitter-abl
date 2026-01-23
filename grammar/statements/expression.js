module.exports = ({ kw, tkw }) => ({
  expression_statement: ($) =>
    prec(
      -1,
      seq(
        $._statement_expression,
        optional(alias($.__expression_no_error, $.no_error)),
        $._terminator,
      ),
    ),
  __expression_no_error: ($) => tkw("NO-ERROR"),
});
