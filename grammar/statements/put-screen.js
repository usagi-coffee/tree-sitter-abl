export default ({ kw }) => ({
  put_screen_statement: ($) => seq($._kw_put, $.__put_screen_body, $._terminator),

  __put_screen_body: ($) =>
    seq(
      kw("SCREEN"),
      optional(alias($.__put_screen_color_phrase, $.color_phrase)),
      $.__put_screen_output,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-choice
  __put_screen_output: ($) =>
    choice(
      // Standard order: [ROW] [COL] value.
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        optional(seq($._kw_row, field("row", $._expression))),
        optional(
          // oxlint-disable-next-line tree-sitter-optimize/shared-choice
          seq(choice($._kw_column, kw("COL")), field("column", $._expression)),
        ),
        field("value", $._expression),
      ),
      // Legacy order: value ROW [COL]. ROW is required to disambiguate.
      seq(
        field("value", $._expression),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._kw_row, field("row", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        optional(
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/shared-choice, tree-sitter-optimize/inline-keyword-owner
          seq(choice($._kw_column, kw("COL")), field("column", $._expression)),
        ),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  __put_screen_color_phrase: ($) => seq($._kw_color, field("color", $._expression)),
});
