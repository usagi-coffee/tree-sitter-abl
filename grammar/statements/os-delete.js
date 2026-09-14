export default ({ kw }) => ({
  os_delete_statement: ($) => seq($.__os_delete_prefix, $._terminator),

  __os_delete_prefix: ($) =>
    seq(kw("OS-DELETE"), $.__os_delete_targets, optional(alias(kw("RECURSIVE"), $.recursive))),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __os_delete_target: ($) =>
    choice($._string_or_identifier_access_or_call, seq($._value_expression_opener, ")")),
  __os_delete_targets: ($) =>
    prec.right(seq($.__os_delete_target, optional($.__os_delete_targets))),
});
