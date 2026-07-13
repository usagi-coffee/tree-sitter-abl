export default ({ kw }) => ({
  wait_for_statement: ($) => seq($.__wait_for_prefix, $._terminator),

  __wait_for_prefix: ($) =>
    seq(
      kw("WAIT-FOR"),
      alias($.__wait_for_of_phrase, $.of_phrase),
      repeat(seq(kw("OR"), alias($.__wait_for_of_phrase, $.of_phrase))),
      optional(alias($.__wait_for_focus_phrase, $.focus_phrase)),
      optional(alias($.__wait_for_pause_phrase, $.pause_phrase)),
    ),
  __wait_for_of_phrase: ($) =>
    seq(
      field("events", $.__wait_for_event_list),
      kw("OF"),
      field("widgets", $.__wait_for_widget_list),
    ),
  __wait_for_focus_phrase: ($) => seq(kw("FOCUS"), field("focus", $.widget_phrase)),
  __wait_for_pause_phrase: ($) => seq(kw("PAUSE"), field("duration", $._expression)),

  __wait_for_event: ($) => $._events,
  __wait_for_widget_list: ($) =>
    prec.right(seq($.widget_phrase, repeat(seq(",", $.widget_phrase)))),
  __wait_for_event_list: ($) =>
    seq($.__wait_for_event, repeat(seq(optional(","), $.__wait_for_event))),
});
