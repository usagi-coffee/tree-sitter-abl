export default ({ kw }) => ({
  conditional_expression: ($) => seq($.__conditional_head, $.__conditional_middle, $._expression),

  __conditional_head: ($) => seq(kw("IF"), $._expression, $.__conditional_then),
  __conditional_middle: ($) => seq($._expression, $.__conditional_else),
  __conditional_then: ($) => kw("THEN"),
  __conditional_else: ($) => kw("ELSE"),
});
