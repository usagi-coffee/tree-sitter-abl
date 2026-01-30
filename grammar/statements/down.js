module.exports = ({ kw, tkw }) => ({
  down_statement: ($) =>
    seq(
      tkw("DOWN"),
      optional(alias($.__down_stream_phrase, $.stream_phrase)),
      optional(field("count", $._expression)),
      optional($.frame_phrase),
      $._terminator,
    ),
  __down_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
