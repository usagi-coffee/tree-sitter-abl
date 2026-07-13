module.exports = ({ kw }) => ({
  conditional_expression: ($) =>
    seq(
      $.__conditional_prefix,
      $._expression,
      $.__conditional_then,
      $._expression,
      $.__conditional_else,
      $._expression,
    ),

  __conditional_prefix: ($) => kw("IF"),
  __conditional_then: ($) => kw("THEN"),
  __conditional_else: ($) => kw("ELSE"),
});
