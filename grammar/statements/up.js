module.exports = ({ kw }) => ({
  up_statement: ($) => seq(kw("UP"), optional($.__up_down_tail), $._terminator),
  __up_down_tail: ($) =>
    choice(
      seq($._stream_phrase, optional($.__up_down_tail_after_stream)),
      seq(field("count", $._expression), optional($.frame_phrase)),
      $.frame_phrase,
    ),
  __up_down_tail_after_stream: ($) =>
    choice(seq(field("count", $._expression), optional($.frame_phrase)), $.frame_phrase),
});
