module.exports = ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__work_table_shared_scope, $.shared_variable_scope),
          alias($.__work_table_access_modifier, $.access_modifier)
        )
      ),
      kw("WORKFILE"),
      $.__work_table_body,
      $._terminator
    ),
});
