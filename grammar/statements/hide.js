module.exports = ({ kw, tkw }) => ({
  hide_statement: ($) =>
    seq(
      tkw("HIDE"),
      optional(alias($.__hide_stream_phrase, $.stream_phrase)),
      optional(
        choice(
          alias($.__hide_widget_phrase, $.widget_phrase),
          tkw("MESSAGE"),
          tkw("ALL"),
        ),
      ),
      optional(tkw("NO-PAUSE")),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
  __hide_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __hide_widget_phrase: ($) =>
    choice(
      seq(kw("FRAME"), field("frame", $.identifier)),
      field("widget", $.identifier),
    ),
});
