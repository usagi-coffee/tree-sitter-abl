export default ({ kw }) => ({
  view_statement: ($) => seq($.__view_prefix, $._terminator),
  __view_prefix: ($) => seq(kw("VIEW"), optional($._stream_phrase), optional($.__view_window_tail)),
  __view_window_tail: ($) =>
    choice(seq($.__view_widgets, optional($.in_window_phrase)), $.in_window_phrase),
  __view_widgets: ($) => prec.right(seq($.widget_phrase, optional($.__view_widgets))),
});
