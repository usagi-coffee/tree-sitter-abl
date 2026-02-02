module.exports = ({ kw }) => ({
  down_statement: ($) =>
    seq(
      kw("DOWN"),
      optional($.__down_stream),
      optional(field("count", $._expression)),
      optional($.frame_phrase),
      $._terminator,
    ),

  __down_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
