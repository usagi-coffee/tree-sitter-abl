module.exports = ({ kw }) => ({
  os_command_statement: ($) =>
    seq(
      kw("OS-COMMAND"),
      optional(choice(kw("SILENT"), token(/NO-WAIT/i), token(/NO-CONSOLE/i))),
      repeat1(choice($.__os_command_value_target, $.__os_command_token)),
      $._terminator,
    ),

  __os_command_value_target: ($) =>
    seq(token(/VALUE/i), "(", $._expression, ")"),
  __os_command_token: ($) =>
    choice(
      $.identifier,
      $.string_literal,
      $.number_literal,
      $.constant,
      $.__os_command_switch,
    ),
  __os_command_switch: () => token(/\/[^\s.]+/),
});
