module.exports = ({ kw }) => ({
  hide_statement: ($) =>
    seq(
      kw("HIDE"),
      optional($.__hide_stream),
      optional(choice($.widget_phrase, kw("MESSAGE"), kw("ALL"))),
      optional(kw("NO-PAUSE")),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  __hide_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
