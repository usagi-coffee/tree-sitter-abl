module.exports = ({ kw }) => ({
  slider_phrase: ($) =>
    seq(
      kw("SLIDER"),
      kw("MAX-VALUE"),
      field("max", $.number_literal),
      kw("MIN-VALUE"),
      field("min", $.number_literal),
      optional(choice(kw("HORIZONTAL"), kw("VERTICAL"))),
      optional(kw("NO-CURRENT-VALUE")),
      optional(kw("LARGE-TO-SMALL")),
      optional($.__slider_tic_marks),
      optional(seq(kw("TOOLTIP"), field("tooltip", $._expression))),
      optional($.size_phrase),
    ),

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
