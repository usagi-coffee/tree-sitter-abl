module.exports = ({ kw }) => ({
  os_delete_statement: ($) =>
    seq(
      kw("OS-DELETE"),
      repeat1(choice($.__os_delete_value_target, $._expression)),
      optional(token(/RECURSIVE/i)),
      $._terminator,
    ),

  __os_delete_value_target: ($) => seq(token(/VALUE/i), "(", $._expression, ")"),
});
