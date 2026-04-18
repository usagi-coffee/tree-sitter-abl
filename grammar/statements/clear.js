module.exports = ({ kw }) => ({
  clear_statement: ($) => seq(kw("CLEAR"), optional($.__clear_tail), $._terminator),
  __clear_tail: ($) =>
    choice(
      seq($.__clear_frame, optional($.__clear_tail_after_frame)),
      $.__clear_all_no_pause_tail,
    ),
  __clear_tail_after_frame: ($) => $.__clear_all_no_pause_tail,
  __clear_all_no_pause_tail: ($) =>
    choice(
      seq(alias(kw("ALL"), $.all), optional(alias(kw("NO-PAUSE"), $.no_pause))),
      alias(kw("NO-PAUSE"), $.no_pause),
    ),
  __clear_frame: ($) => seq(kw("FRAME"), field("frame", $.identifier)),
});
