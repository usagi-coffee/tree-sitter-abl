export default ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) => seq($.__workfile_prefix, $._terminator),

  __workfile_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._work_table_modifier),
      kw("WORKFILE"),
      $._work_table_body,
    ),
});
