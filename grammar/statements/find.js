module.exports = ({ kw, tkw }) => ({
  find_statement: ($) =>
    seq(
      kw("FIND"),
      optional(choice(kw("FIRST"), kw("LAST"), kw("CURRENT"))),
      field("table", $.__find_record_name),
      optional(alias($.__find_of_clause, $.of_clause)),
      repeat($._find_record_option_or_where),
      $._terminator,
    ),

  _find_record_option: ($) =>
    choice(
      alias($.__find_no_lock, $.no_lock),
      alias($.__find_exclusive_lock, $.exclusive_lock),
      alias($.__find_no_wait, $.no_wait),
      alias($.__find_no_error, $.no_error),
      alias($.__find_no_prefetch, $.no_prefetch),
      alias($.__find_using_clause, $.using_clause),
      alias($.__find_use_index, $.use_index),
    ),

  _find_record_option_or_where: ($) =>
    choice($._find_record_option, alias($.__find_where_clause, $.where_clause)),

  __find_of_clause: ($) => seq(kw("OF"), $.__find_record_name),
  __find_where_clause: ($) => seq(kw("WHERE"), $._expression),
  __find_record_name: ($) => choice($.identifier, $.qualified_name),
  __find_no_lock: ($) => tkw("NO-LOCK"),
  __find_no_error: ($) => tkw("NO-ERROR"),
  __find_no_wait: ($) => tkw("NO-WAIT"),
  __find_no_prefetch: ($) => tkw("NO-PREFETCH"),
  __find_exclusive_lock: ($) => tkw("EXCLUSIVE-LOCK"),
  __find_using_clause: ($) => seq(kw("USING"), $._expression_list),
  __find_use_index: ($) =>
    seq(kw("USE-INDEX"), field("index", $.__find_index_name)),
  __find_index_name: ($) => choice($.identifier, $.qualified_name),
});
