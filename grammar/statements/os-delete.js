module.exports = ({ kw }) => ({
  os_delete_statement: ($) =>
    seq(kw("OS-DELETE"), $.__os_delete_body, $._terminator),

  __os_delete_body: ($) =>
    seq(
      repeat1(choice($.__os_delete_value_target, $._expression)),
      optional(kw("RECURSIVE")),
    ),

  __os_delete_value_target: ($) => seq(kw("VALUE"), "(", $._expression, ")"),
});
