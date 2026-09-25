export default ({ kw }) => ({
  view_as_phrase: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("VIEW-AS"),
      choice(
        $.combo_box_phrase,
        $.editor_phrase,
        // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
        seq(
          field("widget", $._kw_fill_in),
          optional(kw("NATIVE")),
          optional($.__radio_set_size_tooltip_tail),
        ),
        $.radio_set_phrase,
        $.selection_list_phrase,
        $.slider_phrase,
        seq(field("widget", $._kw_text), optional($.__radio_set_size_tooltip_tail)),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        seq(field("widget", kw("TOGGLE-BOX")), optional($.__radio_set_size_tooltip_tail)),
      ),
    ),
  __view_as_alert_box: ($) => seq(field("widget", kw("ALERT-BOX")), optional($._alert_box_options)),
});
