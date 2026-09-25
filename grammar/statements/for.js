export default ({ kw }) => ({
  for_statement: ($) => seq($.__for_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __for_prefix: ($) => seq(optional($._label), $.__for_body, $._kw_end),

  __for_body: ($) =>
    seq(
      $._kw_for,
      $.__for_record_or_variables,
      optional($.__for_while_transaction_tail),
      $.__for_block_body,
    ),
  __for_block_body: ($) =>
    seq(optional($._block_options), optional($.__for_with_stream_io_phrase), $.body),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __for_while_transaction_tail: ($) =>
    choice(
      seq(
        alias($.__do_while_phrase, $.while_phrase),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("TRANSACTION", { offset: 5 }), $.transaction)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      seq(alias(kw("TRANSACTION", { offset: 5 }), $.transaction), optional($.__for_sort_clauses)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __for_sort_clause: ($) =>
    choice(
      alias($.__for_by_phrase, $.by_phrase),
      alias($.__for_group_by_phrase, $.group_by_phrase),
      alias($.__for_collate_phrase, $.collate_phrase),
      alias($.__for_break_by, $.break_by),
    ),
  __for_sort_clauses: ($) => prec.right(seq($.__for_sort_clause, optional($.__for_sort_clauses))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __for_record_or_variables: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq($.__for_record_phrases, optional($.__for_sort_clauses), optional($._loop_phrase)),
      $._loop_phrase,
    ),

  __for_record_phrases: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/recurse
    seq(optional(seq($.__for_record_phrases, ",")), $.__for_record),

  __for_record: ($) =>
    seq(
      optional(
        // oxlint-disable-next-line tree-sitter-optimize/shared-choice
        choice($._kw_each, $._kw_first, $._kw_last),
      ),
      $.record_phrase,
    ),

  __for_by_phrase: ($) => prec.right($.__for_by_clause),
  __for_group_by_phrase: ($) => prec.right(seq($._kw_group, $.__for_by_clause)),

  __for_break_by: ($) => prec.right(seq($._kw_break, $.__for_by_clause)),
  __for_by_clause: ($) =>
    seq($._kw_by, prec.right(seq($.__for_by_item, optional($.__for_by_items_tail)))),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-alias-sequence
  __for_with_stream_io_phrase: ($) => seq($._with_keyword, alias($._kw_stream_io, $.stream_io)),

  __for_by_items_tail: ($) =>
    prec.right(seq($._kw_by, $.__for_by_item, optional($.__for_by_items_tail))),
  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  __for_by_item: ($) =>
    seq(
      field("by", $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
    ),

  __for_collate_phrase: ($) =>
    seq(
      $._collate_body,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(field("sort_order", kw("DESCENDING", { offset: 4 }))),
    ),
});
