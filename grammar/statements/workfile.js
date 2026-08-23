export default ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) => seq($.__workfile_prefix, $._terminator),

  __workfile_prefix: ($) =>
    seq(
      $._define_keyword,
      optional($._definition_scope_modifier),
      kw("WORKFILE"),
      $._work_table_body,
    ),
});
