export default ({ kw }) => ({
  repeat_statement: ($) => seq($.__repeat_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-sequence
  __repeat_prefix: ($) => seq(optional($._label), $.__repeat_body, $._end_keyword),

  __repeat_body: ($) =>
    seq(
      kw("REPEAT"),
      optional(alias($._for_phrase, $.for_phrase)),
      optional($._selection_after_for),
      $.__repeat_body_tail,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __repeat_body_tail: ($) =>
    choice(seq($._loop_phrase, optional($.__repeat_body_after_loop)), $.__repeat_body_after_loop),
  __repeat_body_after_loop: ($) =>
    choice(
      seq($.__repeat_condition_transaction, optional($.__repeat_body_after_transaction)),
      $.__repeat_body_after_transaction,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __repeat_condition_transaction: ($) =>
    choice(
      seq(
        $.__repeat_condition_phrase,
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(alias(kw("TRANSACTION", { offset: 5 }), $.transaction)),
      ),
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        alias(kw("TRANSACTION", { offset: 5 }), $.transaction),
        optional($.__repeat_condition_phrase),
      ),
    ),
  __repeat_body_after_transaction: ($) => choice(seq($._block_options, $.body), $.body),

  __repeat_condition_phrase: ($) =>
    seq(choice(kw("WHILE"), kw("UNTIL")), field("condition", $._expression)),
});
