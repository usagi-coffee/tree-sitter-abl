module.exports = ({ kw, tkw }) => ({
  readkey_statement: ($) =>
    seq(
      tkw("READKEY"),
      optional(alias($.__readkey_stream_clause, $.stream_clause)),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      $._terminator,
    ),
  __readkey_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
