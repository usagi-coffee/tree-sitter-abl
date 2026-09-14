export default ({ kw }) => ({
  at_phrase: ($) =>
    seq(
      $._at_keyword,
      prec.right(
        seq(
          choice(
            seq($.__at_column_row, optional($._alignment)),
            seq($.__at_x_y, optional($._alignment)),
            field("position", $._expression),
          ),
        ),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __at_column_row: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/recurse
    repeat1(
      choice(
        seq(
          kw("COLUMN", { offset: 3 }),
          choice(field("column", $._expression), alias($.__at_of_suffix, $.column_of)),
        ),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("COLUMN-OF"), field("column_of", $._expression)),
        seq($._row_keyword, choice(field("row", $._expression), alias($.__at_of_suffix, $.row_of))),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("ROW-OF"), field("row_of", $._expression)),
      ),
    ),
  __at_of_suffix: ($) => prec.right(seq($._of_keyword, $._expression)),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __at_x_y: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/recurse
    repeat1(
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("X"), field("x", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("X-OF"), field("x_of", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("Y"), field("y", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("Y-OF"), field("y_of", $._expression)),
      ),
    ),
});
