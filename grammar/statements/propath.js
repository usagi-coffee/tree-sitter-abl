module.exports = ({ kw }) => ({
  propath_statement: ($) =>
    seq(
      kw("PROPATH"),
      choice("=", "+="),
      field("value", $._expression),
      $._terminator,
    ),
});
