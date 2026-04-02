module.exports = ({ kw }) => ({
  up_statement: ($) => seq(kw("UP"), optional($.__up_down_tail), $._terminator),
  __up_down_tail: ($) =>
    choice(seq($._stream_phrase, optional($.__up_down_count_frame)), $.__up_down_count_frame),
  __up_down_count_frame: ($) =>
    choice(seq(field("count", $._expression), optional($.frame_phrase)), $.frame_phrase),
});
