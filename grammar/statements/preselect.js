module.exports = ({ kw, tkw }) => ({
  preselect_record_list: ($) =>
    seq($.preselect_record, repeat(seq(",", $.preselect_record))),

  preselect_record: ($) =>
    seq(
      optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
      field("table", $.__preselect_record_name),
      optional(seq(kw("OF"), field("of", $.__preselect_record_name))),
      repeat(
        choice(
          alias($.__preselect_where_phrase, $.where_phrase),
          alias($.__preselect_no_lock, $.no_lock),
        ),
      ),
    ),

  __preselect_where_phrase: ($) => seq(kw("WHERE"), $._expression),
  __preselect_no_lock: ($) => tkw("NO-LOCK"),
  __preselect_record_name: ($) => choice($.identifier, $.qualified_name),
});
