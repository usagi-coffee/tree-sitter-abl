module.exports = ({ kw }) => ({
  up_statement: ($) =>
    seq(
      kw("UP"),
      optional($._stream_phrase),
      optional(field("count", $._expression)),
      optional($.frame_phrase),
      $._terminator,
    ),
});
