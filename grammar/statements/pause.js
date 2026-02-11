module.exports = ({ kw }) => ({
  pause_statement: ($) =>
    seq(
      kw("PAUSE"),
      optional(field("duration", $._expression)),
      optional(alias(kw("BEFORE-HIDE"), $.before_hide)),
      optional(
        choice(
          seq(kw("MESSAGE"), field("message", $.string_literal)),
          alias(kw("NO-MESSAGE"), $.no_message),
        ),
      ),
      optional($.in_window_phrase),
      $._terminator,
    ),
});
