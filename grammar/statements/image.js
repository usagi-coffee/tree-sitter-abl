module.exports = ({ kw }) => ({
  image_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional(alias(kw("PRIVATE"), $.access_modifier)),
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
          seq(kw("LIKE"), field("like", $.identifier)),
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
});
