module.exports = ({ kw }) => ({
  expression_statement: ($) =>
    seq(
      $._statement_expression,
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),
});
