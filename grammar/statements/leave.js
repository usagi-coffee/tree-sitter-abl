export default ({ kw }) => ({
  leave_statement: ($) => seq($.__leave_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __leave_prefix: ($) => seq($._kw_leave, optional(field("label", $.identifier))),
});
