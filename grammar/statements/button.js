export default ({ kw }) => ({
  button_definition: ($) => seq($.__button_prefix, $._terminator),

  __button_prefix: ($) =>
    seq($._define_private_prefix, choice(kw("BUTTON"), kw("BUTTONS")), $.__button_body),

  __button_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          alias(kw("AUTO-GO"), $.auto_go),
          alias(kw("AUTO-ENDKEY"), $.auto_endkey),
          alias(kw("DEFAULT"), $.default),
          $._color_font_option,
          seq(kw("CONTEXT-HELP-ID"), field("context_help_id", $._expression)),
          alias(kw("DROP-TARGET"), $.drop_target),
          seq(kw("IMAGE-DOWN"), field("image_down", $.image_phrase)),
          seq(kw("IMAGE"), field("image", $.image_phrase)),
          seq(kw("IMAGE-UP"), field("image_up", $.image_phrase)),
          seq(kw("IMAGE-INSENSITIVE"), field("image_insensitive", $.image_phrase)),
          seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
          seq(kw("LABEL"), field("label", $._identifier_or_string_literal)),
          seq(kw("LIKE"), field("like", $.identifier)),
          $._size_phrase,
          seq(alias(kw("NO-FOCUS"), $.no_focus), optional(alias(kw("FLAT-BUTTON"), $.flat_button))),
          alias(kw("NO-CONVERT-3D-COLORS"), $.no_convert_3d_colors),
          seq(
            kw("TOOLTIP"),
            field("tooltip", choice($._identifier_or_string_literal, $.null_literal)),
          ),
        ),
      ),
    ),
});
