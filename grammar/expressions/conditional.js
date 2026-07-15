export default ({ kw }) => ({
  conditional_expression: ($) =>
    seq($.__conditional_head, $._expression, $.__conditional_else, $._expression),

  __conditional_head: ($) => seq($.__conditional_prefix, $._expression, $.__conditional_then),
  __conditional_prefix: ($) => kw("IF"),
  __conditional_then: ($) => kw("THEN"),
  __conditional_else: ($) => kw("ELSE"),
});
