module.exports = ({ kw }) => ({
  view_statement: ($) =>
    seq(
      kw("VIEW"),
      optional($._stream_phrase),
      optional($.widget_phrase),
      optional($.in_window_phrase),
      $._terminator,
    ),
});
