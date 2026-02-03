module.exports = ({ kw }) => ({
  set_pointer_value_statement: ($) =>
    seq(kw("SET-POINTER-VALUE"), $.__set_pointer_value_body, $._terminator),

  __set_pointer_value_body: ($) =>
    seq(
      "(",
      field(
        "target",
        choice($._identifier_or_qualified_name, $.object_access),
      ),
      ")",
      "=",
      field("value", $._expression),
    ),
});
