module.exports = ({ kw, tkw }) => ({
  work_table_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(
        choice(
          alias($.__work_table_shared_scope, $.shared_variable_scope),
          alias($.__work_table_access_modifier, $.access_modifier)
        )
      ),
      kw("WORK-TABLE"),
      $.__work_table_body,
      $._terminator
    ),

  __work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__temp_table_like_phrase, $.like_phrase)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      repeat(alias($.__temp_table_field, $.field))
    ),

  __work_table_shared_scope: ($) =>
    choice(seq(kw("NEW"), kw("SHARED")), kw("SHARED")),

  __work_table_access_modifier: ($) => kw("PRIVATE"),

  __work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($.__temp_table_like_phrase, $.like_phrase)),
      optional(alias($.__temp_table_no_undo, $.no_undo)),
      repeat(
        choice(
          alias($.__temp_table_field, $.field),
          alias($.__temp_table_index, $.index)
        )
      )
    ),
});
