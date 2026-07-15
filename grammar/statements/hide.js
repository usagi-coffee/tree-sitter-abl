export default ({ kw }) => ({
  hide_statement: ($) => seq($.__hide_prefix, $._terminator),
  __hide_prefix: ($) => seq(kw("HIDE"), optional($.__hide_tail)),
  __hide_tail: ($) =>
    choice(seq($._stream_phrase, optional($.__hide_after_stream)), $.__hide_after_stream),
  __hide_after_stream: ($) =>
    choice(seq($.__hide_target, optional($.__hide_window_tail)), $.__hide_window_tail),
  __hide_window_tail: ($) =>
    choice(
      seq(alias(kw("NO-PAUSE"), $.no_pause), optional($.in_window_phrase)),
      $.in_window_phrase,
    ),
  __hide_target: ($) =>
    choice(alias(kw("MESSAGE"), $.message), alias(kw("ALL"), $.all), $.widget_phrase),
});
