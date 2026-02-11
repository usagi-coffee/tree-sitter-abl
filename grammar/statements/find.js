module.exports = ({ kw }) => ({
  find_statement: ($) => seq(kw("FIND"), $.__find_body, $._terminator),

  __find_body: ($) =>
    seq(
      optional(
        choice(
          alias(kw("FIRST"), $.first),
          alias(kw("LAST"), $.last),
          alias(kw("NEXT"), $.next),
          alias(kw("PREV"), $.prev),
          alias(kw("CURRENT"), $.current),
        ),
      ),
      field("table", $.__find_record_name),
      optional(field("constant", $._expression)),
      optional(alias($.__find_of_phrase, $.of_phrase)),
      repeat($._find_record_option_or_where),
    ),

  _find_record_option: ($) =>
    choice(
      alias(kw("NO-LOCK"), $.no_lock),
      choice(
        alias(kw("SHARE-LOCK"), $.share_lock),
        alias(kw("SHARE"), $.share),
      ),
      choice(
        alias(kw("EXCLUSIVE-LOCK"), $.exclusive_lock),
        alias(kw("EXCLUSIVE"), $.exclusive),
      ),
      alias(kw("NO-WAIT"), $.no_wait),
      alias(kw("NO-ERROR"), $.no_error),
      alias(kw("NO-PREFETCH"), $.no_prefetch),
      seq(kw("USING"), field("values", $._expressions)),
      seq(kw("USE-INDEX"), field("index", $.__find_index_name)),
    ),

  _find_record_option_or_where: ($) =>
    choice($._find_record_option, alias($.__find_where_phrase, $.where_phrase)),

  __find_of_phrase: ($) => seq(kw("OF"), field("record", $.__find_record_name)),
  __find_where_phrase: ($) => seq(kw("WHERE"), field("where", $._expression)),
  __find_record_name: ($) => $._identifier_or_qualified_name,
  __find_index_name: ($) => $._identifier_or_qualified_name,
});
