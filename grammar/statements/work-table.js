export default ({ kw }) => ({
  work_table_definition: ($) => seq($.__work_table_prefix, $._terminator),

  __work_table_prefix: ($) =>
    seq($._kw_define, optional($._definition_scope_modifier), kw("WORK-TABLE"), $._work_table_body),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-shared-sequence-inline
  _work_table_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
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
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __work_table_like_no_undo_tail: ($) =>
    choice(
      seq(alias($._like_phrase, $.like_phrase), optional(alias($._kw_no_undo, $.no_undo))),
      alias($._kw_no_undo, $.no_undo),
    ),
});
