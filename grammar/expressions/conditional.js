export default ({ kw }) => ({
  conditional_expression: ($) => seq($.__conditional_prefix, $._expression),

  __conditional_prefix: ($) => seq(kw("IF"), $._expression, kw("THEN"), $._expression, kw("ELSE")),
});
