export default ({ kw }) => ({
  button_definition: ($) => seq($.__button_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice-sequence
  __button_prefix: ($) =>
    seq($._define_private_prefix, choice(kw("BUTTON"), kw("BUTTONS")), $.__button_body),

  __button_body: ($) =>
    seq(
      field("name", $.identifier),
      // oxlint-disable-next-line tree-sitter-optimize/recurse
      repeat(
        choice(
          alias(kw("AUTO-GO"), $.auto_go),
          alias(kw("AUTO-ENDKEY"), $.auto_endkey),
          alias(kw("AUTO-END-KEY"), $.auto_endkey),
          alias($._kw_default, $.default),
          $._color_font_option,
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._kw_context_help_id, field("context_help_id", $._expression)),
          // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
          alias(kw("DROP-TARGET"), $.drop_target),
          seq(kw("IMAGE-DOWN"), field("image_down", $.image_phrase)),
          seq($._kw_image, field("image", $.image_phrase)),
          seq(kw("IMAGE-UP"), field("image_up", $.image_phrase)),
          seq(kw("IMAGE-INSENSITIVE"), field("image_insensitive", $.image_phrase)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._kw_label, field("label", $._identifier_or_string_literal)),
          // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
          seq($._like_keyword, field("like", $.identifier)),
          seq($.__size_prefix, field("height", $._expression)),
          seq(alias(kw("NO-FOCUS"), $.no_focus), optional(alias(kw("FLAT-BUTTON"), $.flat_button))),
          alias(kw("NO-CONVERT-3D-COLORS"), $.no_convert_3d_colors),
          seq(
            $._kw_tooltip,
            field("tooltip", choice($._identifier_or_string_literal, $.null_literal)),
          ),
        ),
      ),
    ),
});
