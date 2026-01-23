module.exports = ({ kw }) => ({
  conditional_expression: ($) =>
    seq(
      kw("IF"),
      $._expression,
      kw("THEN"),
      $._expression,
      kw("ELSE"),
      $._expression,
    ),
});
