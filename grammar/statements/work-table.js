module.exports = ({ kw }) => ({
  work_table_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__work_table_modifier),
      kw("WORK-TABLE"),
      $.__work_table_body,
      $._terminator,
    ),

  __work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__temp_table_like_phrase, $.like_phrase)),
      optional($.__temp_table_no_undo),
      repeat(
        choice(
          alias($.__temp_table_field, $.field),
          alias($.__temp_table_index, $.index),
        ),
      ),
    ),
  __work_table_modifier: ($) =>
    choice(
      seq(
        alias(kw("NEW"), $.new_modifier),
        alias(kw("SHARED"), $.scope_modifier),
      ),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
