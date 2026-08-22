export default ({ kw }) => ({
  repeat_statement: ($) => seq($.__repeat_statement_prefix, $._terminator),

  __repeat_statement_prefix: ($) => seq(optional($._label), $.__repeat_body, kw("END")),

  __repeat_body: ($) =>
    seq(
      kw("REPEAT"),
      optional(alias($._for_phrase, $.for_phrase)),
      optional($.__repeat_selection_after_for),
      $.__repeat_body_tail,
    ),
  __repeat_selection_after_for: ($) =>
    choice(seq($.preselect_phrase, optional($.query_tuning_phrase)), $.query_tuning_phrase),
  __repeat_body_tail: ($) =>
    choice(seq($._loop_phrase, optional($.__repeat_body_after_loop)), $.__repeat_body_after_loop),
  __repeat_body_after_loop: ($) =>
    choice(
      seq(
        $.__repeat_condition_phrase,
        optional(alias(kw("TRANSACTION", { offset: 5 }), $.transaction)),
        optional($.__repeat_body_after_transaction),
      ),
      seq(
        alias(kw("TRANSACTION", { offset: 5 }), $.transaction),
        optional($.__repeat_condition_phrase),
        optional($.__repeat_body_after_transaction),
      ),
      $.__repeat_body_after_transaction,
    ),
  __repeat_body_after_transaction: ($) => choice(seq(repeat1($._block_option), $.body), $.body),

  __repeat_condition_phrase: ($) =>
    seq(choice(kw("WHILE"), kw("UNTIL")), field("condition", $._expression)),
});
