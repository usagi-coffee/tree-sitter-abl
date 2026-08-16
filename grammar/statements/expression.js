export default ({ kw }) => ({
  expression_statement: ($) =>
    seq(
      choice($._statement_expression, alias($.__expression_keyword_call, $.function_call)),
      $._no_error_terminator,
    ),

  // CLOSE is not a reserved word. A view class defines a Close() method and
  // calls it on the implicit THIS-OBJECT. The call is spelled out here rather
  // than added to function_call, where it would collide with the CLOSE that
  // ends an INPUT or OUTPUT statement.
  __expression_keyword_call: ($) =>
    seq(field("function", alias(kw("CLOSE"), $.identifier)), $.arguments),
});
