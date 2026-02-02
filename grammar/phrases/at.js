module.exports = ({ kw }) => ({
  at_phrase: ($) => seq(kw("AT"), $.__at_phrase_body),

  __at_phrase_body: ($) =>
    prec.right(
      seq(
        choice(
          seq($.__at_column_row, optional($.__at_alignment)),
          seq($.__at_x_y, optional($.__at_alignment)),
          field("position", $._expression),
        ),
      ),
    ),

  __at_column_row: ($) =>
    repeat1(
      choice(
        seq(kw("COLUMN"), field("column", $._expression)),
        seq(kw("COLUMN"), kw("OF"), field("column_of", $._expression)),
        seq(kw("COLUMN-OF"), field("column_of", $._expression)),
        seq(kw("ROW"), field("row", $._expression)),
        seq(kw("ROW"), kw("OF"), field("row_of", $._expression)),
        seq(kw("ROW-OF"), field("row_of", $._expression)),
      ),
    ),

  __at_x_y: ($) =>
    repeat1(
      choice(
        seq(kw("X"), field("x", $._expression)),
        seq(kw("X-OF"), field("x_of", $._expression)),
        seq(kw("Y"), field("y", $._expression)),
        seq(kw("Y-OF"), field("y_of", $._expression)),
      ),
    ),

  __at_alignment: ($) =>
    choice(kw("COLON-ALIGNED"), kw("LEFT-ALIGNED"), kw("RIGHT-ALIGNED")),
});
