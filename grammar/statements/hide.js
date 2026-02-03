module.exports = ({ kw }) => ({
  hide_statement: ($) =>
    seq(
      kw("HIDE"),
      optional($._stream_phrase),
      optional(choice($.__hide_option, $.widget_phrase)),
      optional(kw("NO-PAUSE")),
      optional($.in_window_phrase),
      $._terminator,
    ),

  __hide_option: ($) => choice(kw("MESSAGE"), kw("ALL")),
});
