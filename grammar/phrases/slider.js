export default ({ kw }) => ({
  slider_phrase: ($) =>
    seq(
      kw("SLIDER"),
      kw("MAX-VALUE"),
      field("max", $.number_literal),
      kw("MIN-VALUE"),
      field("min", $.number_literal),
      optional($.__slider_options),
    ),
  __slider_options: ($) =>
    choice(
      seq(choice(kw("HORIZONTAL"), kw("VERTICAL")), optional($.__slider_after_orientation)),
      $.__slider_after_orientation,
    ),
  __slider_after_orientation: ($) =>
    choice(
      seq(kw("NO-CURRENT-VALUE"), optional($.__slider_after_current_value)),
      $.__slider_after_current_value,
    ),
  __slider_after_current_value: ($) =>
    choice(
      seq(kw("LARGE-TO-SMALL"), optional($.__slider_after_direction)),
      $.__slider_after_direction,
    ),
  __slider_after_direction: ($) =>
    choice(
      seq($.__slider_tic_marks, optional($.__slider_after_tic_marks)),
      $.__slider_after_tic_marks,
    ),
  __slider_after_tic_marks: ($) =>
    choice(seq($._tooltip_phrase, optional($.size_phrase)), $.size_phrase),

  __slider_tic_marks: ($) =>
    seq(
      kw("TIC-MARKS"),
      field(
        "marks",
        choice(kw("NONE"), kw("TOP"), kw("BOTTOM"), kw("LEFT"), kw("RIGHT"), kw("BOTH")),
      ),
      optional(seq(kw("FREQUENCY"), field("frequency", $.number_literal))),
    ),
});
