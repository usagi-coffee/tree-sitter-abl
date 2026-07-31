export default ({ kw }) => ({
  conditional_expression: ($) => seq($.__conditional_head, $.__conditional_middle, $._expression),

  __conditional_head: ($) => seq(kw("IF"), $._expression, kw("THEN")),
  __conditional_middle: ($) => seq($._expression, kw("ELSE")),
});
