module.exports = ({ kw }) => ({
  rectangle_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__rectangle_modifier),
      kw("RECTANGLE"),
      $.__rectangle_body,
      $._terminator,
    ),

  __rectangle_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          alias($.__rectangle_like, $.like_option),
          alias($.__rectangle_no_fill, $.no_fill),
          alias($.__rectangle_edge_chars, $.edge_chars),
          alias($.__rectangle_edge_pixels, $.edge_pixels),
          alias($.__rectangle_dcolor, $.dcolor),
          alias($.__rectangle_bgcolor, $.bgcolor),
          alias($.__rectangle_fgcolor, $.fgcolor),
          alias($.__rectangle_graphic_edge, $.graphic_edge),
          alias($.__rectangle_pfcolor, $.pfcolor),
          alias($.__rectangle_rounded, $.rounded),
          alias($.__rectangle_group_box, $.group_box),
          alias($.__rectangle_tooltip, $.tooltip),
          $.size_phrase,
        ),
      ),
    ),

  __rectangle_like: ($) => seq(kw("LIKE"), field("like", $.identifier)),
  __rectangle_no_fill: ($) => kw("NO-FILL"),
  __rectangle_edge_chars: ($) => seq(kw("EDGE-CHARS"), $._expression),
  __rectangle_edge_pixels: ($) => seq(kw("EDGE-PIXELS"), $._expression),
  __rectangle_dcolor: ($) => seq(kw("DCOLOR"), $._expression),
  __rectangle_bgcolor: ($) => seq(kw("BGCOLOR"), $._expression),
  __rectangle_fgcolor: ($) => seq(kw("FGCOLOR"), $._expression),
  __rectangle_graphic_edge: ($) => kw("GRAPHIC-EDGE"),
  __rectangle_pfcolor: ($) => seq(kw("PFCOLOR"), $._expression),
  __rectangle_rounded: ($) => kw("ROUNDED"),
  __rectangle_group_box: ($) => kw("GROUP-BOX"),
  __rectangle_size: ($) =>
    seq(
      choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
      field("width", $._expression),
      kw("BY"),
      field("height", $._expression),
    ),
  __rectangle_tooltip: ($) =>
    seq(kw("TOOLTIP"), choice($.identifier, $.string_literal, $.null_literal)),
  __rectangle_modifier: ($) => alias(kw("PRIVATE"), $.access_modifier),
});
