module.exports = ({ kw }) => ({
  wait_for_statement: ($) =>
    seq(
      kw("WAIT-FOR"),
      field("events", $.__wait_for_event_list),
      kw("OF"),
      $.__wait_for_body,
      $._terminator,
    ),

  __wait_for_body: ($) =>
    seq(
      field("widgets", $.__wait_for_widget_list),
      repeat(
        seq(
          kw("OR"),
          field("events", $.__wait_for_event_list),
          kw("OF"),
          field("widgets", $.__wait_for_widget_list),
        ),
      ),
      optional(seq(kw("FOCUS"), field("focus", $.__wait_for_widget))),
      optional(seq(kw("PAUSE"), field("duration", $._expression))),
    ),

  __wait_for_event_list: ($) =>
    seq($.__wait_for_event, repeat(seq(optional(","), $.__wait_for_event))),
  __wait_for_event: ($) => $.identifier,
  __wait_for_widget_list: ($) =>
    seq($.__wait_for_widget, repeat(seq(optional(","), $.__wait_for_widget))),
  __wait_for_widget: ($) =>
    choice(
      $.identifier,
      $.qualified_name,
      $.scoped_name,
      $.object_access,
      $.function_call,
    ),
});
