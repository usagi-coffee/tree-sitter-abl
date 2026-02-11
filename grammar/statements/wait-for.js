module.exports = ({ kw }) => ({
  wait_for_statement: ($) =>
    seq(kw("WAIT-FOR"), $.__wait_for_body, $._terminator),

  __wait_for_body: ($) =>
    seq(
      alias($.__wait_for_of_phrase, $.of_phrase),
      repeat(
        seq(
          kw("OR"),
          alias($.__wait_for_of_phrase, $.of_phrase),
        ),
      ),
      optional(alias($.__wait_for_focus_phrase, $.focus_phrase)),
      optional(alias($.__wait_for_pause_phrase, $.pause_phrase)),
    ),
  __wait_for_of_phrase: ($) =>
    seq(
      field("events", $.__wait_for_event_list),
      kw("OF"),
      field("widgets", $.__wait_for_widget_list),
    ),
  __wait_for_focus_phrase: ($) =>
    seq(kw("FOCUS"), field("focus", $.widget_phrase)),
  __wait_for_pause_phrase: ($) =>
    seq(kw("PAUSE"), field("duration", $._expression)),

  __wait_for_event: ($) => $._events,
  __wait_for_widget_list: ($) =>
    prec.right(
      seq($.widget_phrase, repeat(seq(",", $.widget_phrase))),
    ),
  __wait_for_event_list: ($) =>
    seq($.__wait_for_event, repeat(seq(optional(","), $.__wait_for_event))),
});
