module.exports = ({ kw }) => ({
  up_statement: ($) =>
    seq(
      kw("UP"),
      optional($.__up_stream),
      optional(field("count", $._expression)),
      optional($.frame_phrase),
      $._terminator,
    ),

  __up_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
