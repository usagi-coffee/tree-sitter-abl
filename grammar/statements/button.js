module.exports = ({ kw }) => ({
  button_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__button_modifier),
      kw("BUTTON"),
      $.__button_body,
      $._terminator,
    ),

  __button_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat($.__button_option),
    ),

  __button_option: ($) =>
    choice(
      alias(kw("AUTO-GO"), $.auto_go),
      alias(kw("AUTO-ENDKEY"), $.auto_endkey),
      alias(kw("DEFAULT"), $.default),
      seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
      seq(kw("CONTEXT-HELP-ID"), field("context_help_id", $._expression)),
      seq(kw("DCOLOR"), field("dcolor", $._expression)),
      alias(kw("DROP-TARGET"), $.drop_target),
      seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
      seq(kw("FONT"), field("font", $._expression)),
      seq(kw("IMAGE-DOWN"), field("image_down", $.image_phrase)),
      seq(kw("IMAGE"), field("image", $.image_phrase)),
      seq(kw("IMAGE-UP"), field("image_up", $.image_phrase)),
      seq(kw("IMAGE-INSENSITIVE"), field("image_insensitive", $.image_phrase)),
      seq(kw("MOUSE-POINTER"), field("mouse_pointer", $._expression)),
      seq(kw("LABEL"), field("label", choice($.string_literal, $.identifier))),
      seq(kw("LIKE"), field("like", $.identifier)),
      seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
      seq(
        choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
        field("width", $._expression),
        kw("BY"),
        field("height", $._expression),
      ),
      seq(
        alias(kw("NO-FOCUS"), $.no_focus),
        optional(alias(kw("FLAT-BUTTON"), $.flat_button)),
      ),
      alias(kw("NO-CONVERT-3D-COLORS"), $.no_convert_3d_colors),
      seq(
        kw("TOOLTIP"),
        field("tooltip", choice($.identifier, $.string_literal, $.null_literal)),
      ),
    ),
  __button_modifier: ($) => alias(kw("PRIVATE"), $.access_modifier),
});
