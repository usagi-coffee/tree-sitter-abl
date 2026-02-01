module.exports = ({ kw }) => ({
  page_statement: ($) =>
    seq(
      kw("PAGE"),
      optional(alias($.__page_stream_phrase, $.stream_phrase)),
      $._terminator,
    ),
  __page_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
