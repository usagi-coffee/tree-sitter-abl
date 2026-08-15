export default ({ kw }) => ({
  image_definition: ($) => seq($.__image_prefix, $._terminator),

  // The syntax box gives the options in a fixed order, ending on the stretch
  // phrase and TRANSPARENT. The AppBuilder does not follow it -- it writes
  // `IMAGE img TRANSPARENT SIZE 5.43 BY 1.5` and `IMAGE imgcli STRETCH-TO-FIT
  // SIZE 42.57 BY 7.29`, both of which compile. One group covers every order
  // the compiler accepts and costs less than the chain of nested optionals it
  // replaces.
  __image_prefix: ($) =>
    seq(
      $._define_private_prefix,
      kw("IMAGE"),
      field("name", $.identifier),
      repeat1($.__image_option),
    ),

  __image_option: ($) =>
    choice(
      $.image_phrase,
      seq(kw("LIKE"), field("like", $.identifier)),
      $.size_phrase,
      seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
      seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
      alias(kw("CONVERT-3D-COLORS"), $.convert_3d_colors),
      $.__image_tooltip_phrase,
      $.__image_stretch_phrase,
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
