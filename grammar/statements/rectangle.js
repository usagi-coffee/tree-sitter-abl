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
          seq(kw("LIKE"), field("like", $.identifier)),
          alias(kw("NO-FILL"), $.no_fill),
          seq(kw("EDGE-CHARS"), field("edge_chars", $._expression)),
          seq(kw("EDGE-PIXELS"), field("edge_pixels", $._expression)),
          seq(kw("DCOLOR"), field("dcolor", $._expression)),
          seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          alias(kw("GRAPHIC-EDGE"), $.graphic_edge),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          alias(kw("ROUNDED"), $.rounded),
          alias(kw("GROUP-BOX"), $.group_box),
          seq(
            kw("TOOLTIP"),
            field(
              "tooltip",
              choice($.identifier, $.string_literal, $.null_literal),
            ),
          ),
          $.size_phrase,
        ),
      ),
    ),
  __rectangle_modifier: ($) => alias(kw("PRIVATE"), $.access_modifier),
});
