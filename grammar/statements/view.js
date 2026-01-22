module.exports = ({ kw, tkw }) => ({
  view_statement: ($) =>
    seq(
      tkw("VIEW"),
      optional(alias($.__view_stream_clause, $.stream_clause)),
      optional(alias($.__view_widget_phrase, $.widget_phrase)),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
  __view_stream_clause: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __view_widget_phrase: ($) =>
    choice(
      seq(kw("FRAME"), field("frame", $.identifier)),
      field("widget", $.identifier),
    ),
});
