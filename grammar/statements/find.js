module.exports = ({ kw }) => ({
  find_statement: ($) => seq(kw("FIND"), $.__find_body, $._terminator),

  __find_body: ($) =>
    seq(
      optional(
        choice(kw("FIRST"), kw("LAST"), kw("NEXT"), kw("PREV"), kw("CURRENT")),
      ),
      field("table", $.__find_record_name),
      optional(field("constant", $._expression)),
      optional(alias($.__find_of_phrase, $.of_phrase)),
      repeat($._find_record_option_or_where),
    ),

  _find_record_option: ($) =>
    choice(
      alias($.__find_no_lock, $.no_lock),
      alias($.__find_exclusive_lock, $.exclusive_lock),
      alias($.__find_no_wait, $.no_wait),
      alias($.__find_no_error, $.no_error),
      alias($.__find_no_prefetch, $.no_prefetch),
      alias($.__find_using_phrase, $.using_phrase),
      alias($.__find_use_index, $.use_index),
    ),

  _find_record_option_or_where: ($) =>
    choice($._find_record_option, alias($.__find_where_phrase, $.where_phrase)),

  __find_of_phrase: ($) => seq(kw("OF"), $.__find_record_name),
  __find_where_phrase: ($) => seq(kw("WHERE"), $._expression),
  __find_record_name: ($) => choice($.identifier, $.qualified_name),
  __find_no_lock: ($) => kw("NO-LOCK"),
  __find_no_error: ($) => kw("NO-ERROR"),
  __find_no_wait: ($) => kw("NO-WAIT"),
  __find_no_prefetch: ($) => kw("NO-PREFETCH"),
  __find_exclusive_lock: ($) => kw("EXCLUSIVE-LOCK"),
  __find_using_phrase: ($) => seq(kw("USING"), $._expressions),
  __find_use_index: ($) =>
    seq(kw("USE-INDEX"), field("index", $.__find_index_name)),
  __find_index_name: ($) => choice($.identifier, $.qualified_name),
});
