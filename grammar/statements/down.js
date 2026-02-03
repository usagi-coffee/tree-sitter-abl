module.exports = ({ kw }) => ({
  down_statement: ($) =>
    seq(
      kw("DOWN"),
      optional($._stream_phrase),
      optional(field("count", $._expression)),
      optional($.frame_phrase),
      $._terminator,
    ),
});
