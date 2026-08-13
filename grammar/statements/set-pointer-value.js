export default ({ kw }) => ({
  set_pointer_value_statement: ($) => seq($.__set_pointer_value_prefix, $._terminator),

  __set_pointer_value_prefix: ($) =>
    seq(
      kw("SET-POINTER-VALUE"),
      "(",
      field("target", choice($._identifier_or_qualified_name, $.object_access)),
      ")",
      "=",
      field("value", $._expression),
    ),
});
