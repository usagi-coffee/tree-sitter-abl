module.exports = ({ kw, tkw }) => ({
  at_phrase: ($) => seq(tkw("AT"), $.__at_phrase_body),

  __at_phrase_body: ($) =>
    seq(
      choice(
        seq($.__at_column_row, optional($.__at_alignment)),
        seq($.__at_x_y, optional($.__at_alignment)),
        field("position", $._expression),
      ),
    ),

  __at_column_row: ($) =>
    prec.left(
      seq(
        choice(
          // COLUMN first, then ROW
          seq(
            choice(
              seq(kw("COLUMN"), field("column", $._expression)),
              seq(tkw("COLUMN-OF"), field("column_of", $._expression)),
            ),
            optional(
              choice(
                seq(kw("ROW"), field("row", $._expression)),
                seq(tkw("ROW-OF"), field("row_of", $._expression)),
              ),
            ),
          ),
          // ROW first, then COLUMN
          seq(
            choice(
              seq(kw("ROW"), field("row", $._expression)),
              seq(tkw("ROW-OF"), field("row_of", $._expression)),
            ),
            choice(
              seq(kw("COLUMN"), field("column", $._expression)),
              seq(tkw("COLUMN-OF"), field("column_of", $._expression)),
            ),
          ),
        ),
      ),
    ),

  __at_x_y: ($) =>
    prec.left(
      seq(
        choice(
          seq(kw("X"), field("x", $._expression)),
          seq(tkw("X-OF"), field("x_of", $._expression)),
        ),
        optional(
          choice(
            seq(kw("Y"), field("y", $._expression)),
            seq(tkw("Y-OF"), field("y_of", $._expression)),
          ),
        ),
      ),
    ),

  __at_alignment: ($) =>
    choice(tkw("COLON-ALIGNED"), tkw("LEFT-ALIGNED"), tkw("RIGHT-ALIGNED")),
});
