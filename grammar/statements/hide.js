module.exports = ({ kw }) => ({
  hide_statement: ($) => seq(kw("HIDE"), optional($.__hide_tail), $._terminator),
  __hide_tail: ($) =>
    choice(
      seq($._stream_phrase, optional($.__hide_tail_after_stream)),
      seq($.__hide_target, optional($.__hide_tail_after_target)),
      seq(alias(kw("NO-PAUSE"), $.no_pause), optional($.in_window_phrase)),
      $.in_window_phrase,
    ),
  __hide_tail_after_stream: ($) =>
    choice(
      seq($.__hide_target, optional($.__hide_tail_after_target)),
      seq(alias(kw("NO-PAUSE"), $.no_pause), optional($.in_window_phrase)),
      $.in_window_phrase,
    ),
  __hide_tail_after_target: ($) =>
    choice(
      seq(alias(kw("NO-PAUSE"), $.no_pause), optional($.in_window_phrase)),
      $.in_window_phrase,
    ),
  __hide_target: ($) =>
    choice(alias(kw("MESSAGE"), $.message), alias(kw("ALL"), $.all), $.widget_phrase),
});
