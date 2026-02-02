module.exports = ({ kw }) => ({
  readkey_statement: ($) =>
    seq(
      kw("READKEY"),
      optional($.__readkey_stream),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      $._terminator,
    ),

  __readkey_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
