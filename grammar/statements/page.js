module.exports = ({ kw, tkw }) => ({
  page_statement: ($) =>
    seq(
      tkw("PAGE"),
      optional(alias($.__page_stream_clause, $.stream_clause)),
      $._terminator,
    ),
  __page_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
