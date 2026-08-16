export default ({ kw }) => ({
  // The syntax box fixes the order MAX-VALUE then MIN-VALUE and makes both
  // mandatory. The compiler takes either order, and takes neither: `VIEW-AS
  // SLIDER` on its own compiles. AppBuilder writes MIN-VALUE first, so the
  // spelled-out order rejected every slider it was given.
  slider_phrase: ($) =>
    seq(
      kw("SLIDER"),
      repeat(
        choice(
          seq(kw("MAX-VALUE"), field("max", $.number_literal)),
          seq(kw("MIN-VALUE"), field("min", $.number_literal)),
        ),
      ),
      optional(choice(kw("HORIZONTAL"), kw("VERTICAL"))),
      optional($.__slider_after_orientation),
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
