module.exports = ({ kw }) => ({
  view_statement: ($) => seq(kw("VIEW"), optional($.__view_tail), $._terminator),
  __view_tail: ($) =>
    choice(
      seq($._stream_phrase, optional($.__view_tail_after_stream)),
      seq($.widget_phrase, optional($.in_window_phrase)),
      $.in_window_phrase,
    ),
  __view_tail_after_stream: ($) =>
    choice(seq($.widget_phrase, optional($.in_window_phrase)), $.in_window_phrase),
});
