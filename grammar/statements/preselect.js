export default ({ kw }) => ({
  preselect_statement: ($) => seq($.__preselect_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __preselect_prefix: ($) => seq(kw("PRESELECT"), $.preselect_record_list),

  preselect_record_list: ($) => seq($.preselect_record, optional($.__preselect_record_list_tail)),
  __preselect_record_list_tail: ($) =>
    prec.right(seq(",", $.preselect_record, optional($.__preselect_record_list_tail))),

  preselect_record: ($) =>
    seq(
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice
        choice(kw("EACH"), $._kw_first, kw("LAST")),
      ),
      $.record_phrase,
    ),
});
