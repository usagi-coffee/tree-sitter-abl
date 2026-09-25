export default ({ kw }) => ({
  os_command_statement: ($) => seq($.__os_command_prefix, $._terminator),

  __os_command_prefix: ($) =>
    seq(
      kw("OS-COMMAND"),
      optional(choice($._kw_silent, kw("NO-WAIT"), kw("NO-CONSOLE"))),
      $.__os_command_items,
    ),
  __os_command_items: ($) =>
    prec.right(
      seq(
        choice(
          $._value_expression,
          $.identifier,
          $.string_literal,
          $.number_literal,
          $.preprocessor_name,
          $.__os_command_switch,
        ),
        optional($.__os_command_items),
      ),
    ),
  __os_command_switch: () => token(/\/[^\s.]+/),
});
