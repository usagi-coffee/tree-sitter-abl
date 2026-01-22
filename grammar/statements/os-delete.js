module.exports = ({ kw, tkw }) => ({
  os_delete_statement: ($) =>
    seq(
      kw("OS-DELETE"),
      repeat1(choice($.__os_delete_value_target, $._expression)),
      optional(tkw("RECURSIVE")),
      $._terminator,
    ),

  __os_delete_value_target: ($) =>
    seq(tkw("VALUE"), "(", $._expression, ")"),
});
