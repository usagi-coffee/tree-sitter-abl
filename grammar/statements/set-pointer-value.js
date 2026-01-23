module.exports = ({ tkw }) => ({
  set_pointer_value_statement: ($) =>
    seq(
      tkw("SET-POINTER-VALUE"),
      "(",
      field("target", $._expression),
      ")",
      "=",
      field("value", $._expression),
      $._terminator,
    ),
});
