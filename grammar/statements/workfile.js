module.exports = ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._work_table_modifier),
      kw("WORKFILE"),
      $._work_table_body,
      $._terminator,
    ),
});
