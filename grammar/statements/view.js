module.exports = ({ kw, tkw }) => ({
  view_statement: ($) =>
    seq(
      tkw("VIEW"),
      optional(alias($.__view_stream_phrase, $.stream_phrase)),
      optional($.widget_phrase),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
  __view_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),

});
