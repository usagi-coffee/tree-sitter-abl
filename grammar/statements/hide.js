module.exports = ({ kw }) => ({
  hide_statement: ($) =>
    seq(
      kw("HIDE"),
      optional($._stream_phrase),
      optional(
        choice(
          alias(kw("MESSAGE"), $.message),
          alias(kw("ALL"), $.all),
          $.widget_phrase,
        ),
      ),
      optional(alias(kw("NO-PAUSE"), $.no_pause)),
      optional($.in_window_phrase),
      $._terminator,
    ),
});
