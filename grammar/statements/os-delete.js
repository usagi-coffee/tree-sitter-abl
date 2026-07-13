export default ({ kw }) => ({
  os_delete_statement: ($) => seq($.__os_delete_prefix, $._terminator),

  __os_delete_prefix: ($) =>
    seq(
      kw("OS-DELETE"),
      repeat1($.__os_delete_target),
      optional(alias(kw("RECURSIVE"), $.recursive)),
    ),

  __os_delete_target: ($) =>
    choice($._os_filename, seq(kw("VALUE"), "(", field("value", $._os_filename), ")")),
});
