export default ({ kw }) => ({
  open_query_statement: ($) => seq($.__open_query_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  __open_query_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_open,
      // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
      $._kw_query,
      field("query", $.identifier),
      choice($._kw_for, kw("PRESELECT")),
      $._kw_each,
      $.__open_query_record_tail,
      optional($.query_tuning_phrase),
      optional($.__open_query_tail_after_tuning),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/optional-tail-choice-collapse
  __open_query_tail_after_tuning: ($) =>
    choice(
      seq(alias($._kw_break, $.break), optional($.__open_query_tail_after_break)),
      $.__open_query_tail_after_break,
    ),
  __open_query_tail_after_break: ($) =>
    choice(
      seq($.__open_query_by_phrases, optional($.__open_query_tail_after_by)),
      $.__open_query_tail_after_by,
    ),
  __open_query_tail_after_by: ($) =>
    choice(
      seq(field("lock", $._lock_option), optional($.__open_query_reposition_tail)),
      $.__open_query_reposition_tail,
    ),
  __open_query_reposition_tail: ($) =>
    choice(
      seq(
        alias(kw("INDEXED-REPOSITION"), $.indexed_reposition),
        optional($.__open_query_max_rows_option),
      ),
      $.__open_query_max_rows_option,
    ),
  __open_query_max_rows_option: ($) => seq(kw("MAX-ROWS"), field("max_rows", $._expression)),
  __open_query_record_tail: ($) =>
    seq(
      alias($.__open_query_record_phrase, $.record_phrase),
      optional($.__open_query_join_records),
    ),
  __open_query_join_records: ($) =>
    prec.right(
      seq(
        ",",
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice, tree-sitter-optimize/inline-keyword-owner
        choice($._kw_each, $._kw_first, $._kw_last),
        $.__open_query_record_tail,
      ),
    ),

  __open_query_record_phrase: ($) =>
    prec.right(
      seq(
        field("record", $._qualified_identifier),
        // oxlint-disable-next-line tree-sitter-optimize/recurse
        repeat(
          choice(
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq($._kw_of, field("of", $._qualified_identifier)),
            // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
            seq($._kw_where, field("where", $._expression)),
            seq($._kw_use_index, field("index", $.identifier)),
            field("lock", $._lock_option),
            seq(optional(alias($._kw_left, $.left)), alias(kw("OUTER-JOIN"), $.outer_join)),
          ),
        ),
      ),
    ),
  __open_query_by_phrase: ($) =>
    seq(
      $._kw_by,
      field("by", $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
    ),
  __open_query_by_phrases: ($) =>
    prec.right(
      seq(alias($.__open_query_by_phrase, $.by_phrase), optional($.__open_query_by_phrases)),
    ),
});
