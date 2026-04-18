module.exports = ({ kw }) => ({
  pause_statement: ($) => seq(kw("PAUSE"), optional($.__pause_tail), $._terminator),
  __pause_tail: ($) =>
    choice(
      seq(field("duration", $._expression), optional($.__pause_tail_after_duration)),
      seq(alias(kw("BEFORE-HIDE"), $.before_hide), optional($.__pause_tail_after_before_hide)),
      $.__pause_message_window_tail,
    ),
  __pause_tail_after_duration: ($) =>
    choice(
      seq(alias(kw("BEFORE-HIDE"), $.before_hide), optional($.__pause_tail_after_before_hide)),
      $.__pause_message_window_tail,
    ),
  __pause_tail_after_before_hide: ($) => $.__pause_message_window_tail,
  __pause_message_window_tail: ($) =>
    choice(seq($.__pause_message, optional($.in_window_phrase)), $.in_window_phrase),
  __pause_message: ($) =>
    choice(
      seq(kw("MESSAGE"), field("message", $.string_literal)),
      alias(kw("NO-MESSAGE"), $.no_message),
    ),
});
