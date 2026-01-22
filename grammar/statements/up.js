module.exports = ({ kw, tkw }) => ({
  up_statement: ($) =>
    seq(
      tkw("UP"),
      optional(alias($.__up_stream_clause, $.stream_clause)),
      optional(field("count", $._expression)),
      optional(alias($.__up_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __up_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __up_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
