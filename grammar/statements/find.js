export default ({ kw }) => ({
  find_statement: ($) => seq($.__find_prefix, $._terminator),

  __find_prefix: ($) =>
    seq(
      kw("FIND"),
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
      optional($.__find_options),
    ),

  __find_options: ($) =>
    prec.right(
      seq(
        choice(
          alias($.__find_of_phrase, $.of_phrase),
          $._find_record_option,
          alias($.__find_where_phrase, $.where_phrase),
        ),
        optional($.__find_options),
      ),
    ),

  _find_record_option: ($) =>
    choice(
      $._lock_option,
      alias(kw("SHARE"), $.share),
      alias(kw("EXCLUSIVE"), $.exclusive),
      alias(kw("NO-WAIT"), $.no_wait),
      alias(kw("NO-ERROR"), $.no_error),
      alias(kw("NO-PREFETCH"), $.no_prefetch),
      seq($._using_keyword, field("values", $._expressions)),
      seq(kw("USE-INDEX"), field("index", $.__find_index_name)),
    ),

  __find_of_phrase: ($) => seq($._of_keyword, field("record", $.__find_record_name)),
  __find_where_phrase: ($) => seq(kw("WHERE"), field("where", $._expression)),
  __find_record_name: ($) => $._identifier_or_qualified_name,
  __find_index_name: ($) => $._identifier_or_qualified_name,
});
