const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  work_table_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      ...definitionModifiers($, kw, {
        access: ["PRIVATE"],
        new: true,
        scope: ["SHARED"],
      }),
      kw("WORK-TABLE"),
      $.__work_table_body,
      $._terminator,
    ),

  __work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__temp_table_like_phrase, $.like_phrase)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      repeat(
        choice(
          alias($.__temp_table_field, $.field),
          alias($.__temp_table_index, $.index),
        ),
      ),
    ),
});
