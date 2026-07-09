module.exports = ({ kw }) => ({
  readkey_statement: ($) => seq($.__readkey_prefix, $._terminator),
  __readkey_prefix: ($) =>
    seq(
      kw("READKEY"),
      optional(
        choice(
          seq($._stream_phrase, optional(alias($.__readkey_pause_phrase, $.pause_phrase))),
          alias($.__readkey_pause_phrase, $.pause_phrase),
        ),
      ),
    ),
  __readkey_pause_phrase: ($) => seq(kw("PAUSE"), field("pause", $._expression)),
});
