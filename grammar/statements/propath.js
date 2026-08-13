export default ({ kw }) => ({
  propath_statement: ($) => seq($.__propath_prefix, $._terminator),

  __propath_prefix: ($) => seq(kw("PROPATH"), choice("=", "+="), field("value", $._expression)),
});
