export default ({ kw }) => ({
  find_statement: ($) => seq($.__find_prefix, $._terminator),

  __find_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
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
      field("table", $._identifier_or_qualified_name),
      optional(field("constant", $._expression)),
      optional($.__find_options),
    ),

  __find_options: ($) =>
    prec.right(
      seq(
        choice($.of_phrase, $._find_record_option, alias($.__find_where_phrase, $.where_phrase)),
        optional($.__find_options),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  _find_record_option: ($) =>
    choice(
      $._lock_option,
      alias(kw("SHARE"), $.share),
      alias(kw("EXCLUSIVE"), $.exclusive),
      alias(kw("NO-WAIT"), $.no_wait),
      alias(kw("NO-ERROR"), $.no_error),
      alias(kw("NO-PREFETCH"), $.no_prefetch),
      seq($._using_keyword, field("values", $._expressions)),
      seq(kw("USE-INDEX"), field("index", $._identifier_or_qualified_name)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __find_where_phrase: ($) => seq(kw("WHERE"), field("where", $._expression)),
});
