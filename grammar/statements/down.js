module.exports = ({ kw, tkw }) => ({
  down_statement: ($) =>
    seq(
      tkw("DOWN"),
      optional(alias($.__down_stream_clause, $.stream_clause)),
      optional(field("count", $._expression)),
      optional(alias($.__down_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __down_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __down_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
