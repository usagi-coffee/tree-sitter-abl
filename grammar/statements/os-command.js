module.exports = ({ kw }) => ({
  os_command_statement: ($) =>
    seq(kw("OS-COMMAND"), $.__os_command_body, $._terminator),

  __os_command_body: ($) =>
    seq(
      optional(choice(kw("SILENT"), kw("NO-WAIT"), kw("NO-CONSOLE"))),
      repeat1(choice($.__os_command_value_target, $.__os_command_token)),
    ),

  __os_command_value_target: ($) => seq(kw("VALUE"), "(", $._expression, ")"),
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
