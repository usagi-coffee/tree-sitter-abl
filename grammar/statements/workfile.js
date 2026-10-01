export default ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) => seq($.__workfile_prefix, $._terminator),

  // Retain this declaration boundary to limit specialization of the shared table body.
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __workfile_prefix: ($) => seq($._define_scope_prefix, kw("WORKFILE"), $._work_table_body),
});
