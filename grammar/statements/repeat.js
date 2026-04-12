module.exports = ({ kw }) => ({
  repeat_statement: ($) => seq(optional($._label), $.__repeat_body, kw("END"), $._terminator),

  __repeat_body: ($) =>
    seq(
      kw("REPEAT"),
      optional(alias($._for_phrase, $.for_phrase)),
      optional($.preselect_phrase),
      optional($.query_tuning_phrase),
      $.__repeat_body_tail,
    ),
  __repeat_body_tail: ($) =>
    choice(
      seq($._loop_phrase, optional($.__repeat_body_after_loop)),
      seq($.__repeat_condition_phrase, optional($.__repeat_body_after_condition)),
      seq(alias(kw("TRANSACTION"), $.transaction), optional($.__repeat_body_after_transaction)),
      seq(repeat1($.__repeat_block_option), $.body),
      $.body,
    ),
  __repeat_body_after_loop: ($) =>
    choice(
      seq($.__repeat_condition_phrase, optional($.__repeat_body_after_condition)),
      seq(alias(kw("TRANSACTION"), $.transaction), optional($.__repeat_body_after_transaction)),
      seq(repeat1($.__repeat_block_option), $.body),
      $.body,
    ),
  __repeat_body_after_condition: ($) =>
    choice(
      seq(alias(kw("TRANSACTION"), $.transaction), optional($.__repeat_body_after_transaction)),
      seq(repeat1($.__repeat_block_option), $.body),
      $.body,
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

  __repeat_break_by_phrase: ($) =>
    prec.right(
      seq(
        optional(alias(kw("BREAK"), $.break)),
        kw("BY"),
        field("by", $._expression),
        optional($.__repeat_sort_direction),
        repeat(seq(kw("BY"), field("by", $._expression), optional($.__repeat_sort_direction))),
      ),
    ),
  __repeat_condition_phrase: ($) =>
    seq(choice(kw("WHILE"), kw("UNTIL")), field("condition", $._expression)),
  __repeat_sort_direction: ($) => field("sort_order", kw("DESCENDING", { offset: 4 })),
});
