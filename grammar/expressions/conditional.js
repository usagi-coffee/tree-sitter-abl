export default ({ kw }) => ({
  conditional_expression: ($) => seq($.__conditional_prefix, $._expression),

  __conditional_prefix: ($) => seq($._kw_if, $._expression, $._kw_then, $._expression, kw("ELSE")),
});
