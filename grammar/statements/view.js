module.exports = ({ kw }) => ({
  view_statement: ($) =>
    seq(
      kw("VIEW"),
      optional($.__view_stream),
      optional($.widget_phrase),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  __view_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
