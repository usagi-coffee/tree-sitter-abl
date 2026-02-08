module.exports = ({ kw }) => ({
  wait_for_statement: ($) =>
    seq(kw("WAIT-FOR"), $.__wait_for_body, $._terminator),

  __wait_for_body: ($) =>
    seq(
      field("events", $.__wait_for_event_list),
      kw("OF"),
      field("widgets", $.__wait_for_widget_list),
      repeat(
        seq(
          kw("OR"),
          field("events", $.__wait_for_event_list),
          kw("OF"),
          field("widgets", $.__wait_for_widget_list),
        ),
      ),
      optional(
        seq(
          kw("FOCUS"),
          field("focus", $.widget_phrase),
        ),
      ),
      optional(seq(kw("PAUSE"), field("duration", $._expression))),
    ),

  __wait_for_event: ($) => $._events,
  __wait_for_widget_list: ($) =>
    prec.right(
      seq($.widget_phrase, repeat(seq(",", $.widget_phrase))),
    ),
  __wait_for_event_list: ($) =>
    seq($.__wait_for_event, repeat(seq(optional(","), $.__wait_for_event))),
});
