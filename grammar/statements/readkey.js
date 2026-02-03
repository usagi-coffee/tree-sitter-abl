module.exports = ({ kw }) => ({
  readkey_statement: ($) =>
    seq(
      kw("READKEY"),
      optional($.__readkey_stream),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      $._terminator,
    ),

  __readkey_stream: ($) => $._stream_phrase,
});
