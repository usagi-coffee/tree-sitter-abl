module.exports = ({ kw }) => ({
  view_statement: ($) =>
    seq(
      kw("VIEW"),
      optional($.__view_stream),
      optional($.widget_phrase),
      optional($.__view_in_window),
      $._terminator,
    ),

  __view_in_window: ($) =>
    $._in_window_phrase,

  __view_stream: ($) => $._stream_phrase,
});
