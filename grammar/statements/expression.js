export default ({ kw }) => ({
  expression_statement: ($) =>
    seq(
      choice($._statement_expression, alias($.__expression_keyword_call, $.function_call)),
      $._no_error_terminator,
    ),

  __expression_keyword_call: ($) =>
    seq(field("function", alias(kw("CLOSE"), $.identifier)), $.arguments),
});
