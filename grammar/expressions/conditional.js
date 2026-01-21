module.exports = ({ op }) => ({
  conditional_expression: ($) =>
    seq(
      op("IF"),
      $._expression,
      op("THEN"),
      $._expression,
      op("ELSE"),
      $._expression,
    ),
});
