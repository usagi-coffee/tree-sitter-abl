export default ({ kw }) => ({
  work_table_definition: ($) => seq($.__work_table_prefix, $._terminator),

  __work_table_prefix: ($) =>
    seq(
      $._define_keyword,
      optional($._definition_scope_modifier),
      kw("WORK-TABLE"),
      $._work_table_body,
    ),

  _work_table_body: ($) =>
    seq(
      field("name", $.identifier),
      optional($.__work_table_like_no_undo_tail),
      optional($.__work_table_items),
    ),
  __work_table_items: ($) =>
    prec.right(
      seq(
        choice(alias($._table_field, $.field), alias($._table_index, $.index)),
        optional($.__work_table_items),
      ),
    ),
  __work_table_like_no_undo_tail: ($) =>
    choice(
      seq(alias($._like_phrase, $.like_phrase), optional(alias($._no_undo_keyword, $.no_undo))),
      alias($._no_undo_keyword, $.no_undo),
    ),
});
