export default ({ kw }) => ({
  repeat_statement: ($) => seq($.__repeat_statement_prefix, $._terminator),

  __repeat_statement_prefix: ($) => seq(optional($._label), $.__repeat_body, kw("END")),

  __repeat_body: ($) =>
    seq(
      kw("REPEAT"),
      optional(alias($._for_phrase, $.for_phrase)),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      $.__repeat_body_tail,
    ),
  __repeat_body_tail: ($) =>
    choice(seq($._loop_phrase, optional($.__repeat_body_after_loop)), $.__repeat_body_after_loop),
  __repeat_body_after_loop: ($) =>
    choice(
      seq($.__repeat_condition_phrase, optional($.__repeat_body_after_condition)),
      $.__repeat_body_after_condition,
    ),
  __repeat_body_after_condition: ($) =>
    choice(
      seq(
        alias(kw("TRANSACTION", { offset: 5 }), $.transaction),
        optional($.__repeat_body_after_transaction),
      ),
      $.__repeat_body_after_transaction,
    ),
  __repeat_body_after_transaction: ($) =>
    choice(seq(repeat1($.__repeat_block_option), $.body), $.body),
  __repeat_block_option: ($) =>
    choice(
      $.stop_after_phrase,
      $.on_endkey_phrase,
      $.on_stop_phrase,
      $.on_error_phrase,
      $.on_quit_phrase,
      $.frame_phrase,
    ),

  __repeat_condition_phrase: ($) =>
    seq(choice(kw("WHILE"), kw("UNTIL")), field("condition", $._expression)),
});
