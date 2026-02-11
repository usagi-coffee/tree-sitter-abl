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
      optional(seq(kw("BGCOLOR"), field("bgcolor", $._expression))),
      optional(seq(kw("FGCOLOR"), field("fgcolor", $._expression))),
      optional(alias(kw("CONVERT-3D-COLORS"), $.convert_3d_colors)),
      optional(
        seq(
          kw("TOOLTIP"),
          field("tooltip", choice($.string_literal, $.identifier)),
        ),
      ),
      optional(
        seq(
          alias(kw("STRETCH-TO-FIT"), $.stretch_to_fit),
          optional(alias(kw("RETAIN-SHAPE"), $.retain_shape)),
        ),
      ),
      optional(alias(kw("TRANSPARENT"), $.transparent)),
    ),
});
