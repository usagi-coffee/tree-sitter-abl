module.exports = ({ kw }) => ({
  readkey_statement: ($) =>
    seq(
      kw("READKEY"),
      optional($._stream_phrase),
      optional(alias($.__readkey_pause_phrase, $.pause_phrase)),
      $._terminator,
    ),
  __readkey_pause_phrase: ($) =>
    seq(kw("PAUSE"), field("pause", $._expression)),
});
