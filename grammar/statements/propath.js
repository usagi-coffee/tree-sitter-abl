module.exports = ({ kw }) => ({
  propath_statement: ($) =>
    seq(kw("PROPATH"), $.__propath_body, $._terminator),

  __propath_body: ($) => seq(choice("=", "+="), field("value", $._expression)),
});
