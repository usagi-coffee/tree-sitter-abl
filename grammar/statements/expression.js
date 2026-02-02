module.exports = ({ kw }) => ({
  expression_statement: ($) =>
    seq(
      $._statement_expression,
      optional(alias($.__expression_no_error, $.no_error)),
      $._terminator,
    ),
  __expression_no_error: ($) => kw("NO-ERROR"),
});
