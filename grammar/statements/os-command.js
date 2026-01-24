module.exports = ({ kw, tkw }) => ({
  os_command_statement: ($) =>
    seq(
      kw("OS-COMMAND"),
      optional(choice(kw("SILENT"), tkw("NO-WAIT"), tkw("NO-CONSOLE"))),
      repeat1(choice($.__os_command_value_target, $.__os_command_token)),
      $._terminator,
    ),

  __os_command_value_target: ($) => seq(tkw("VALUE"), "(", $._expression, ")"),
  __os_command_token: ($) =>
    choice(
      $.identifier,
      $.string_literal,
      $.number_literal,
      alias($.constant_expression, $.constant),
      $.__os_command_switch,
    ),
  __os_command_switch: () => token(/\/[^\s.]+/),
});
