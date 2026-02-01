const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  // Workfile is equivalent to WORK-TABLE
  workfile_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      ...definitionModifiers($, kw, {
        access: ["PRIVATE"],
        new: true,
        scope: ["SHARED"],
      }),
      kw("WORKFILE"),
      $.__work_table_body,
      $._terminator,
    ),
});
