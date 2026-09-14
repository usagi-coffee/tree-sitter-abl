export default ({ kw }) => ({
  put_screen_statement: ($) => seq(kw("PUT"), $.__put_screen_body, $._terminator),

  __put_screen_body: ($) =>
    seq(
      kw("SCREEN"),
      optional(alias($.__put_screen_color_phrase, $.color_phrase)),
      $.__put_screen_output,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __put_screen_output: ($) =>
    choice(
      // Standard order: [ROW] [COL] value.
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        optional(seq($._row_keyword, field("row", $._expression))),
        optional(seq(choice(kw("COLUMN"), kw("COL")), field("column", $._expression))),
        field("value", $._expression),
      ),
      // Legacy order: value ROW [COL]. ROW is required to disambiguate.
      seq(
        field("value", $._expression),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._row_keyword, field("row", $._expression)),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        optional(seq(choice(kw("COLUMN"), kw("COL")), field("column", $._expression))),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/sequence-subset
  __put_screen_color_phrase: ($) => seq(kw("COLOR"), field("color", $._expression)),
});
