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
    seq(kw("IN"), kw("WINDOW"), field("window", $._expression)),

  __view_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
