module.exports = ({ kw }) => ({
  image_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(kw("PRIVATE")),
      kw("IMAGE"),
      $.__image_body,
      $._terminator,
    ),

  __image_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat1(
        choice(
          alias($.__image_phrase, $.image_phrase),
          alias($.__image_like_phrase, $.like_phrase),
          $.size_phrase,
        ),
      ),
      optional(seq(kw("BGCOLOR"), $._expression)),
      optional(seq(kw("FGCOLOR"), $._expression)),
      optional(kw("CONVERT-3D-COLORS")),
      optional(
        seq(
          kw("TOOLTIP"),
          field("tooltip", choice($.string_literal, $.identifier)),
        ),
      ),
      optional(seq(kw("STRETCH-TO-FIT"), optional(kw("RETAIN-SHAPE")))),
      optional(kw("TRANSPARENT")),
    ),

  __image_phrase: ($) =>
    seq(
      kw("FILE"),
      field("file", $.string_literal),
      optional(
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
      ),
      optional(
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
      ),
    ),
  __image_like_phrase: ($) => seq(kw("LIKE"), field("like", $.identifier)),
});
