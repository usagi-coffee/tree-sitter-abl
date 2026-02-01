module.exports = ({ kw }) => ({
  set_pointer_value_statement: ($) =>
    seq(kw("SET-POINTER-VALUE"), $.__set_pointer_value_body, $._terminator),

  __set_pointer_value_body: ($) =>
    seq(
      "(",
      field("target", $._expression),
      ")",
      "=",
      field("value", $._expression),
    ),
});
