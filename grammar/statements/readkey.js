module.exports = ({ kw }) => ({
  readkey_statement: ($) =>
    seq(
      kw("READKEY"),
      optional($._stream_phrase),
      optional(seq(kw("PAUSE"), field("pause", $._expression))),
      $._terminator,
    ),
});
