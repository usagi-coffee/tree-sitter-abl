module.exports = ({ kw }) => ({
  propath_statement: ($) =>
    seq(kw("PROPATH"), $.__propath__body, $._terminator),

  __propath__body: ($) => seq(choice("=", "+="), field("value", $._expression)),
});
