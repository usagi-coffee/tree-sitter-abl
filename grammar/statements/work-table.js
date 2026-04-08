module.exports = ({ kw }) => ({
  work_table_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._work_table_modifier),
      kw("WORK-TABLE"),
      $._work_table_body,
      $._terminator,
    ),

  _work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($._like_phrase, $.like_phrase)),
      optional(alias(kw("NO-UNDO"), $.no_undo)),
      repeat(choice(alias($._table_field, $.field), alias($._table_index, $.index))),
    ),
  _work_table_modifier: ($) =>
    choice(
      seq(alias(kw("NEW"), $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
