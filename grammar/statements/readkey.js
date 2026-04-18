module.exports = ({ kw }) => ({
  readkey_statement: ($) => seq(kw("READKEY"), optional($.__readkey_body), $._terminator),
  __readkey_body: ($) =>
    choice(
      seq($._stream_phrase, optional(alias($.__readkey_pause_phrase, $.pause_phrase))),
      alias($.__readkey_pause_phrase, $.pause_phrase),
    ),
  __readkey_pause_phrase: ($) => seq(kw("PAUSE"), field("pause", $._expression)),
});
