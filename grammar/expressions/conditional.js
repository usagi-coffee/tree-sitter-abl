export default ({ kw }) => ({
  conditional_expression: ($) => seq($.__conditional_prefix, $._expression),

  __conditional_prefix: ($) => seq($._kw_if, $._expression, kw("THEN"), $._expression, kw("ELSE")),
});
