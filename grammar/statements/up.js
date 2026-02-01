module.exports = ({ kw }) => ({
  up_statement: ($) =>
    seq(
      kw("UP"),
      optional(alias($.__up_stream_phrase, $.stream_phrase)),
      optional(field("count", $._expression)),
      optional($.frame_phrase),
      $._terminator,
    ),

  __up_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
