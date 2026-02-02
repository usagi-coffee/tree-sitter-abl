module.exports = ({ kw }) => ({
  hide_statement: ($) =>
    seq(
      kw("HIDE"),
      optional($.__hide_stream),
      optional(choice($.__hide_option, $.widget_phrase)),
      optional(kw("NO-PAUSE")),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),

  __hide_option: ($) => choice(kw("MESSAGE"), kw("ALL")),
  __hide_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
