module.exports = ({ kw }) => ({
  preselect_statement: ($) =>
    seq(kw("PRESELECT"), $.preselect_record_list, $._terminator),

  preselect_record_list: ($) =>
    seq($.preselect_record, repeat(seq(",", $.preselect_record))),

  preselect_record: ($) =>
    seq(
      optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
      $.record_phrase,
    ),
});
