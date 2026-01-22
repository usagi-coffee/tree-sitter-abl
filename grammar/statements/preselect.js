module.exports = ({ kw, tkw }) => ({
  preselect_record_list: ($) =>
    seq(
      $.preselect_record,
      repeat(seq(",", $.preselect_record)),
    ),

  preselect_record: ($) =>
    choice(
      seq(
        optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
        field("table", $.__preselect_record_name),
        optional(seq(kw("OF"), field("of", $.__preselect_record_name))),
        optional(alias($.__preselect_where_clause, $.where_clause)),
        optional(alias($.__preselect_no_lock, $.no_lock)),
      ),
      seq(
        optional(choice(kw("EACH"), kw("FIRST"), kw("LAST"))),
        field("table", $.__preselect_record_name),
        optional(seq(kw("OF"), field("of", $.__preselect_record_name))),
        optional(alias($.__preselect_no_lock, $.no_lock)),
        optional(alias($.__preselect_where_clause, $.where_clause)),
      ),
    ),

  __preselect_where_clause: ($) => seq(kw("WHERE"), $._expression),
  __preselect_no_lock: ($) => tkw("NO-LOCK"),
  __preselect_record_name: ($) => choice($.identifier, $.qualified_name),
});
