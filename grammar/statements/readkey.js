export default ({ kw }) => ({
  readkey_statement: ($) => seq($.__readkey_prefix, $._terminator),
  __readkey_prefix: ($) =>
    seq(
      kw("READKEY"),
      optional(
        choice(
          seq($._stream_phrase, optional(alias($.__readkey_pause_phrase, $.pause_phrase))),
          // oxlint-disable-next-line tree-sitter-optimize/phrase-alias-extraction
          alias($.__readkey_pause_phrase, $.pause_phrase),
        ),
      ),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
  __readkey_pause_phrase: ($) => seq(kw("PAUSE"), field("pause", $._expression)),
});
