export default ({ kw }) => ({
  os_delete_statement: ($) => seq($.__os_delete_prefix, $._terminator),

  __os_delete_prefix: ($) =>
    seq(kw("OS-DELETE"), $.__os_delete_targets, optional(alias(kw("RECURSIVE"), $.recursive))),

  __os_delete_target: ($) =>
    choice($._os_filename, seq(kw("VALUE"), "(", field("value", $._expression), ")")),
  __os_delete_targets: ($) =>
    prec.right(seq($.__os_delete_target, optional($.__os_delete_targets))),
});
