module.exports = ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__work_table_modifier),
      kw("WORKFILE"),
      $.__work_table_body,
      $._terminator,
    ),
});
