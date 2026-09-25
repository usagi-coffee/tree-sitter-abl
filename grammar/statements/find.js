export default ({ kw }) => ({
  find_statement: ($) => seq($.__find_prefix, $._terminator),

  __find_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("FIND"),
      optional(
        choice(
          alias($._kw_first, $.first),
          alias($._kw_last, $.last),
          alias($._kw_next, $.next),
          alias($._kw_prev, $.prev),
          alias($._kw_current, $.current),
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

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-shared-choice-inline
  _find_record_option: ($) =>
    choice(
      $._lock_option,
      alias(kw("SHARE"), $.share),
      alias(kw("EXCLUSIVE"), $.exclusive),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-WAIT"), $.no_wait),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-ERROR"), $.no_error),
      alias(kw("NO-PREFETCH"), $.no_prefetch),
      seq($._using_keyword, field("values", $._expressions)),
      seq($._kw_use_index, field("index", $._identifier_or_qualified_name)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __find_where_phrase: ($) => seq($._kw_where, field("where", $._expression)),
});
