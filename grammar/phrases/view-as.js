module.exports = ({ kw }) => ({
  view_as_phrase: ($) =>
    seq(
      kw("VIEW-AS"),
      choice(
        $.combo_box_phrase,
        $.editor_phrase,
        $.__view_as_fill_in,
        $.radio_set_phrase,
        $.selection_list_phrase,
        $.slider_phrase,
        $.__view_as_text,
        $.__view_as_toggle_box,
      ),
    ),

  __view_as_fill_in: ($) =>
    seq(
      kw("FILL-IN"),
      optional(kw("NATIVE")),
      optional($.size_phrase),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
    ),
  __view_as_text: ($) =>
    seq(
      kw("TEXT"),
      optional($.size_phrase),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
    ),
  __view_as_toggle_box: ($) =>
    seq(
      kw("TOGGLE-BOX"),
      optional($.size_phrase),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
    ),
});
