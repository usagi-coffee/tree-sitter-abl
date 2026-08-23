export default ({ kw }) => ({
  expression_statement: ($) => seq($.__expression_statement_body, $._no_error_terminator),
  __expression_statement_body: ($) =>
    choice($._statement_expression, alias($.__expression_keyword_call, $.function_call)),

  __expression_keyword_call: ($) =>
    seq(field("function", alias(kw("CLOSE"), $.identifier)), $.arguments),
});
