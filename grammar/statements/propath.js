module.exports = ({ kw }) => ({
  propath_statement: ($) => seq($.__propath_prefix, $._terminator),

  __propath_prefix: ($) => seq(kw("PROPATH"), $.__propath_body),
  __propath_body: ($) => seq(choice("=", "+="), field("value", $._expression)),
});
