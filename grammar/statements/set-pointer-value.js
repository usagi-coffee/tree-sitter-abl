export default ({ kw }) => ({
  set_pointer_value_statement: ($) => seq($.__set_pointer_value_prefix, $._terminator),

  __set_pointer_value_prefix: ($) =>
    seq(
      kw("SET-POINTER-VALUE"),
      "(",
      field("target", choice($._qualified_identifier, $.object_access)),
      $._close_equals_value,
    ),
});
