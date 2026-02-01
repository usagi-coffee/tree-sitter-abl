module.exports = ({ kw }) => ({
  readkey_statement: ($) =>
    seq(
      kw("READKEY"),
      optional(alias($.__readkey_stream_phrase, $.stream_phrase)),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      $._terminator,
    ),

  __readkey_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
