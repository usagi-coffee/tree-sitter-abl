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
      repeat1(choice($.image_phrase, seq(kw("LIKE"), field("like", $.identifier)), $.size_phrase)),
      optional($.__image_body_tail),
    ),
  __image_body_tail: ($) =>
    choice(
      seq(kw("BGCOLOR"), field("bgcolor", $._expression), optional($.__image_body_after_bgcolor)),
      seq(kw("FGCOLOR"), field("fgcolor", $._expression), optional($.__image_body_after_fgcolor)),
      seq(
        alias(kw("CONVERT-3D-COLORS"), $.convert_3d_colors),
        optional($.__image_body_after_convert_3d_colors),
      ),
      seq($.__image_tooltip_phrase, optional($.__image_body_after_tooltip)),
      seq($.__image_stretch_phrase, optional(alias(kw("TRANSPARENT"), $.transparent))),
      alias(kw("TRANSPARENT"), $.transparent),
    ),
  __image_body_after_bgcolor: ($) =>
    choice(
      seq(kw("FGCOLOR"), field("fgcolor", $._expression), optional($.__image_body_after_fgcolor)),
      seq(
        alias(kw("CONVERT-3D-COLORS"), $.convert_3d_colors),
        optional($.__image_body_after_convert_3d_colors),
      ),
      seq($.__image_tooltip_phrase, optional($.__image_body_after_tooltip)),
      seq($.__image_stretch_phrase, optional(alias(kw("TRANSPARENT"), $.transparent))),
      alias(kw("TRANSPARENT"), $.transparent),
    ),
  __image_body_after_fgcolor: ($) =>
    choice(
      seq(
        alias(kw("CONVERT-3D-COLORS"), $.convert_3d_colors),
        optional($.__image_body_after_convert_3d_colors),
      ),
      seq($.__image_tooltip_phrase, optional($.__image_body_after_tooltip)),
      seq($.__image_stretch_phrase, optional(alias(kw("TRANSPARENT"), $.transparent))),
      alias(kw("TRANSPARENT"), $.transparent),
    ),
  __image_body_after_convert_3d_colors: ($) =>
    choice(
      seq($.__image_tooltip_phrase, optional($.__image_body_after_tooltip)),
      seq($.__image_stretch_phrase, optional(alias(kw("TRANSPARENT"), $.transparent))),
      alias(kw("TRANSPARENT"), $.transparent),
    ),
  __image_body_after_tooltip: ($) =>
    choice(
      seq($.__image_stretch_phrase, optional(alias(kw("TRANSPARENT"), $.transparent))),
      alias(kw("TRANSPARENT"), $.transparent),
    ),
  __image_tooltip_phrase: ($) =>
    seq(kw("TOOLTIP"), field("tooltip", $._identifier_or_string_literal)),
  __image_stretch_phrase: ($) =>
    seq(
      alias(kw("STRETCH-TO-FIT"), $.stretch_to_fit),
      optional(alias(kw("RETAIN-SHAPE"), $.retain_shape)),
    ),
});
