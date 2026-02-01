module.exports = ({ kw }) => ({
  hide_statement: ($) =>
    seq(
      kw("HIDE"),
      optional(alias($.__hide_stream_phrase, $.stream_phrase)),
      optional(choice($.widget_phrase, kw("MESSAGE"), kw("ALL"))),
      optional(kw("NO-PAUSE")),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  __hide_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
