export default ({ kw }) => ({
  view_as_phrase: ($) =>
    seq(
      kw("VIEW-AS"),
      choice(
        $.combo_box_phrase,
        $.editor_phrase,
        seq(
          field("widget", kw("FILL-IN")),
          optional(kw("NATIVE")),
          optional($.__view_as_size_tooltip_tail),
        ),
        $.radio_set_phrase,
        $.selection_list_phrase,
        $.slider_phrase,
        seq(field("widget", kw("TEXT")), optional($.__view_as_size_tooltip_tail)),
        seq(field("widget", kw("TOGGLE-BOX")), optional($.__view_as_size_tooltip_tail)),
      ),
    ),
  __view_as_size_tooltip_tail: ($) =>
    choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase),
  __view_as_alert_box: ($) => seq(field("widget", kw("ALERT-BOX")), optional($._alert_box_options)),
});
