export default ({ kw }) => ({
  work_table_definition: ($) => seq($.__work_table_prefix, $._terminator),

  __work_table_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._definition_scope_modifier),
      kw("WORK-TABLE"),
      $._work_table_body,
    ),

  _work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional(alias($._like_phrase, $.like_phrase)),
      optional(alias(kw("NO-UNDO"), $.no_undo)),
      repeat(choice(alias($._table_field, $.field), alias($._table_index, $.index))),
    ),
});
