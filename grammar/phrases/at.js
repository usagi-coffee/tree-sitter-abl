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
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          kw("COLUMN", { offset: 3 }),
          choice(field("column", $._expression), alias($.__at_of_suffix, $.column_of)),
        ),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_column_of, field("column_of", $._expression)),
        seq($._row_keyword, choice(field("row", $._expression), alias($.__at_of_suffix, $.row_of))),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_row_of, field("row_of", $._expression)),
      ),
    ),
  __at_of_suffix: ($) => prec.right(seq($._of_keyword, $._expression)),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __at_x_y: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/recurse
    repeat1(
      // oxlint-disable-next-line tree-sitter-optimize/choice-subset
      choice(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_x, field("x", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("X-OF"), field("x_of", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_y, field("y", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq(kw("Y-OF"), field("y_of", $._expression)),
      ),
    ),
});
