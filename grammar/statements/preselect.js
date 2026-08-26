export default ({ kw }) => ({
  preselect_statement: ($) => seq($.__preselect_prefix, $._terminator),

  __preselect_prefix: ($) => seq(kw("PRESELECT"), $.preselect_record_list),

  preselect_record_list: ($) => seq($.preselect_record, optional($.__preselect_record_list_tail)),
  __preselect_record_list_tail: ($) =>
    prec.right(seq(",", $.preselect_record, optional($.__preselect_record_list_tail))),

  preselect_record: ($) =>
    seq(optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))), $.record_phrase),
});
