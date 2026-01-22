module.exports = ({ kw, tkw }) => ({
  underline_statement: ($) =>
    seq(
      tkw("UNDERLINE"),
      optional(alias($.__underline_stream_clause, $.stream_clause)),
      repeat1(field("field", $._expression)),
      optional(alias($.__underline_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __underline_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __underline_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
