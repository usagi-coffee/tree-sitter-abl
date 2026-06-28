module.exports = ({ kw }) => ({
  conditional_expression: ($) =>
    seq(
      $.__conditional_prefix,
      $._expression,
      kw("THEN"),
      $._expression,
      kw("ELSE"),
      $._expression,
    ),

  __conditional_prefix: ($) => kw("IF"),
});
