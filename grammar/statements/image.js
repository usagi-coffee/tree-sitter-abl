export default ({ kw }) => ({
  image_definition: ($) => seq($.__image_prefix, $._terminator),

  __image_prefix: ($) =>
    seq($._define_private_prefix, kw("IMAGE"), field("name", $.identifier), $.__image_options),

  __image_options: ($) => prec.right(seq($.__image_option, optional($.__image_options))),

  __image_option: ($) =>
    choice(
      $.image_phrase,
      seq($._like_keyword, field("like", $.identifier)),
      $.size_phrase,
      seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
      seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
      alias(kw("CONVERT-3D-COLORS"), $.convert_3d_colors),
      seq(kw("TOOLTIP"), field("tooltip", $._identifier_or_string_literal)),
      seq(
        alias(kw("STRETCH-TO-FIT"), $.stretch_to_fit),
        optional(alias(kw("RETAIN-SHAPE"), $.retain_shape)),
      ),
      alias(kw("TRANSPARENT"), $.transparent),
    ),
});
