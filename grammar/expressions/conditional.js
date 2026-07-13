module.exports = ({ kw }) => ({
  conditional_expression: ($) =>
    seq(
      $.__conditional_prefix,
      $._expression,
      $.__conditional_then,
      $._expression,
      kw("ELSE"),
      $._expression,
    ),

  __conditional_prefix: ($) => kw("IF"),
  __conditional_then: ($) => kw("THEN"),
});
