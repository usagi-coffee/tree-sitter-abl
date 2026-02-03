module.exports = ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__workfile_modifier),
      kw("WORKFILE"),
      $.__work_table_body,
      $._terminator,
    ),
  __workfile_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
