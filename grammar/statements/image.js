module.exports = ({ kw }) => ({
  image_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__image_modifier),
      kw("IMAGE"),
      $.__image_body,
      $._terminator,
    ),

  __image_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat1(
        choice(
          $.image_phrase,
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

  __image_like_phrase: ($) => seq(kw("LIKE"), field("like", $.identifier)),
  __image_modifier: ($) => alias(kw("PRIVATE"), $.access_modifier),
});
