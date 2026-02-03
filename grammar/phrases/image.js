module.exports = ({ kw }) => ({
  image_phrase: ($) =>
    seq(
      kw("FILE"),
      field("file", $._expression),
      optional($.__image_size_phrase),
      optional($.__image_from_phrase),
    ),

  __image_size_phrase: ($) =>
    seq(
      choice(
        kw("IMAGE-SIZE"),
        kw("IMAGE-SIZE-CHARS"),
        kw("IMAGE-SIZE-PIXELS"),
      ),
      field("width", $.number_literal),
      kw("BY"),
      field("height", $.number_literal),
    ),
  __image_from_phrase: ($) =>
    seq(
      kw("FROM"),
      choice(
        seq(
          kw("X"),
          field("x", $.number_literal),
          kw("Y"),
          field("y", $.number_literal),
        ),
        seq(
          kw("ROW"),
          field("row", $.number_literal),
          kw("COLUMN"),
          field("column", $.number_literal),
        ),
      ),
    ),
});
