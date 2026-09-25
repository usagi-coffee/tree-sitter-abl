export default ({ kw }) => ({
  image_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      choice(kw("FILE"), kw("FILENAME")),
      field("file", $._expression),
      optional(
        seq(
          choice(kw("IMAGE-SIZE"), kw("IMAGE-SIZE-CHARS"), kw("IMAGE-SIZE-PIXELS")),
          $._width_by,
          field("height", $.number_literal),
        ),
      ),
      optional($.__image_from_phrase),
    ),

  __image_from_phrase: ($) =>
    seq(
      $._kw_from,
      choice(
        seq($._kw_x, field("x", $.number_literal), kw("Y"), field("y", $.number_literal)),
        seq(
          $._row_keyword,
          field("row", $.number_literal),
          $._kw_column,
          field("column", $.number_literal),
        ),
      ),
    ),
});
