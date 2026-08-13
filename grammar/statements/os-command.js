export default ({ kw }) => ({
  os_command_statement: ($) => seq($.__os_command_prefix, $._terminator),

  __os_command_prefix: ($) =>
    seq(
      kw("OS-COMMAND"),
      optional(choice(kw("SILENT"), kw("NO-WAIT"), kw("NO-CONSOLE"))),
      repeat1(choice($._value_expression, $.__os_command_token)),
    ),

  __os_command_token: ($) =>
    choice(
      $.identifier,
      $.string_literal,
      $.number_literal,
      $.preprocessor_name,
      $.__os_command_switch,
    ),
  __os_command_switch: () => token(/\/[^\s.]+/),
});
