module.exports = ({ kw }) => ({
  do_statement: ($) => seq(optional($._label), $.__do_body, kw("END"), $._terminator),

  __do_body: ($) =>
    seq(
      kw("DO"),
      optional(alias($._for_phrase, $.for_phrase)),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      $.__do_body_tail,
    ),
  __do_body_tail: ($) =>
    choice(
      seq(alias(kw("TRANSACTION"), $.transaction), optional($.__do_body_after_first_transaction)),
      seq($.__do_condition_or_loop_phrase, optional($.__do_body_after_condition_or_loop)),
      seq(repeat1($.__do_block_option), $.body),
      $.body,
    ),
  __do_body_after_first_transaction: ($) =>
    choice(
      seq($.__do_condition_or_loop_phrase, optional($.__do_body_after_condition_or_loop)),
      seq(repeat1($.__do_block_option), $.body),
      $.body,
    ),
  __do_body_after_condition_or_loop: ($) =>
    choice(
      seq(alias(kw("TRANSACTION"), $.transaction), optional($.__do_body_after_second_transaction)),
      seq(repeat1($.__do_block_option), $.body),
      $.body,
    ),
  __do_body_after_second_transaction: ($) => choice(seq(repeat1($.__do_block_option), $.body), $.body),
  __do_block_option: ($) =>
    choice(
      $.stop_after_phrase,
      $.on_endkey_phrase,
      $.on_stop_phrase,
      $.on_error_phrase,
      $.on_quit_phrase,
      $.frame_phrase,
    ),

  body: ($) =>
    prec.right(seq(choice(alias($._colon, ":"), $._terminator_dot), repeat($._statement))),
  __do_condition_or_loop_phrase: ($) => choice($.__do_while_phrase, $._loop_phrase),
  __do_while_phrase: ($) => seq(kw("WHILE"), field("condition", $._expression)),
});
