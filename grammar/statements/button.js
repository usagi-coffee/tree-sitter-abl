module.exports = ({ kw, tkw }) => ({
  button_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(kw("PRIVATE")),
      kw("BUTTON"),
      field("name", $.identifier),
      repeat(alias($.__button_option, $.button_option)),
      $._terminator,
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
      // $.on_phrase, // TODO: add trigger support
    ),
  __button_auto_go: ($) => tkw("AUTO-GO"),
  __button_auto_endkey: ($) => tkw("AUTO-ENDKEY"),
  __button_default: ($) => tkw("DEFAULT"),
  __button_bgcolor: ($) => seq(kw("BGCOLOR"), $._expression),
  __button_context_help_id: ($) => seq(tkw("CONTEXT-HELP-ID"), $._expression),
  __button_dcolor: ($) => seq(kw("DCOLOR"), $._expression),
  __button_drop_target: ($) => tkw("DROP-TARGET"),
  __button_fgcolor: ($) => seq(kw("FGCOLOR"), $._expression),
  __button_font: ($) => seq(kw("FONT"), $._expression),
  __button_image_down: ($) => seq(tkw("IMAGE-DOWN"), $.__button_image_phrase),
  __button_image: ($) => seq(kw("IMAGE"), $.__button_image_phrase),
  __button_image_up: ($) => seq(tkw("IMAGE-UP"), $.__button_image_phrase),
  __button_image_insensitive: ($) => seq(tkw("IMAGE-INSENSITIVE"), $.__button_image_phrase),
  __button_image_phrase: ($) =>
    seq(
      kw("FILE"),
      field("filename", $._expression),
      optional(
        seq(
          choice(tkw("IMAGE-SIZE"), tkw("IMAGE-SIZE-CHARS"), tkw("IMAGE-SIZE-PIXELS")),
          field("width", $._expression),
          kw("BY"),
          field("height", $._expression),
        ),
      ),
      optional(
        seq(
          kw("FROM"),
          choice(
            seq(kw("X"), $._expression, kw("Y"), $._expression),
            seq(kw("ROW"), $._expression, kw("COLUMN"), $._expression),
          ),
        ),
      ),
    ),
  __button_mouse_pointer: ($) => seq(tkw("MOUSE-POINTER"), $._expression),
  __button_label: ($) => seq(kw("LABEL"), field("label", choice($.string_literal, $.identifier))),
  __button_like: ($) => seq(kw("LIKE"), field("like", $.identifier)),
  __button_pfcolor: ($) => seq(kw("PFCOLOR"), $._expression),
  __button_size: ($) =>
    seq(
      choice(kw("SIZE"), tkw("SIZE-CHARS"), tkw("SIZE-PIXELS")),
      field("width", $._expression),
      kw("BY"),
      field("height", $._expression),
    ),
  __button_no_focus: ($) => seq(tkw("NO-FOCUS"), optional(tkw("FLAT-BUTTON"))),
  __button_no_convert_3d_colors: ($) => tkw("NO-CONVERT-3D-COLORS"),
  __button_tooltip: ($) => seq(kw("TOOLTIP"), $._expression),
});
