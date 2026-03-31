module.exports = ({ kw }) => ({
  expression_statement: ($) => seq($._statement_expression, $._no_error_terminator),
});
