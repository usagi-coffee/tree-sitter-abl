export default ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) => seq($.__workfile_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __workfile_prefix: ($) => seq($._define_scope_prefix, kw("WORKFILE"), $._work_table_body),
});
