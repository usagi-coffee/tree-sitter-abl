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
      repeat(alias($.__button_option, $.button_option)),
    ),

  __button_option: ($) =>
    choice(
      $.__button_auto_go,
      $.__button_auto_endkey,
      $.__button_default,
      $.__button_bgcolor,
      $.__button_context_help_id,
      $.__button_dcolor,
      $.__button_drop_target,
      $.__button_fgcolor,
      $.__button_font,
      $.__button_image_down,
      $.__button_image,
      $.__button_image_up,
      $.__button_image_insensitive,
      $.__button_mouse_pointer,
      $.__button_label,
      $.__button_like,
      $.__button_pfcolor,
      $.__button_size,
      $.__button_no_focus,
      $.__button_no_convert_3d_colors,
      $.__button_tooltip,
    ),

  __button_auto_go: ($) => kw("AUTO-GO"),
  __button_auto_endkey: ($) => kw("AUTO-ENDKEY"),
  __button_default: ($) => kw("DEFAULT"),
  __button_bgcolor: ($) => seq(kw("BGCOLOR"), $._expression),
  __button_context_help_id: ($) => seq(kw("CONTEXT-HELP-ID"), $._expression),
  __button_dcolor: ($) => seq(kw("DCOLOR"), $._expression),
  __button_drop_target: ($) => kw("DROP-TARGET"),
  __button_fgcolor: ($) => seq(kw("FGCOLOR"), $._expression),
  __button_font: ($) => seq(kw("FONT"), $._expression),
  __button_image_down: ($) => seq(kw("IMAGE-DOWN"), $.image_phrase),
  __button_image: ($) => seq(kw("IMAGE"), $.image_phrase),
  __button_image_up: ($) => seq(kw("IMAGE-UP"), $.image_phrase),
  __button_image_insensitive: ($) =>
    seq(kw("IMAGE-INSENSITIVE"), $.image_phrase),
  __button_mouse_pointer: ($) => seq(kw("MOUSE-POINTER"), $._expression),
  __button_label: ($) =>
    seq(kw("LABEL"), field("label", choice($.string_literal, $.identifier))),
  __button_like: ($) => seq(kw("LIKE"), field("like", $.identifier)),
  __button_pfcolor: ($) => seq(kw("PFCOLOR"), $._expression),
  __button_size: ($) =>
    seq(
      choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
      field("width", $._expression),
      kw("BY"),
      field("height", $._expression),
    ),
  __button_no_focus: ($) => seq(kw("NO-FOCUS"), optional(kw("FLAT-BUTTON"))),
  __button_no_convert_3d_colors: ($) => kw("NO-CONVERT-3D-COLORS"),
  __button_tooltip: ($) =>
    seq(
      kw("TOOLTIP"),
      field("tooltip", choice($.identifier, $.string_literal, $.null_literal)),
    ),
  __button_modifier: ($) => alias(kw("PRIVATE"), $.access_modifier),
});
