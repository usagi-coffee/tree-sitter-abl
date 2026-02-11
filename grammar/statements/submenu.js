module.exports = ({ kw }) => ({
  submenu_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional(alias(kw("PRIVATE"), $.access_modifier)),
      kw("SUB-MENU"),
      $.__submenu_body,
      $._terminator,
    ),

  __submenu_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
          seq(kw("DCOLOR"), field("dcolor", $._expression)),
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          seq(kw("FONT"), field("font", $._expression)),
          alias(kw("SUB-MENU-HELP"), $.submenu_help),
          seq(kw("LIKE"), field("like", $.identifier)),
          alias($.__submenu_element, $.menu_element),
        ),
      ),
    ),
  __submenu_element: ($) =>
    choice(
      alias($.__submenu_item, $.menu_item),
      alias($.__submenu_submenu, $.submenu_item),
      alias(kw("RULE"), $.rule),
      alias(kw("SKIP"), $.skip),
    ),
  __submenu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("LABEL"), field("label", $.string_literal)),
          alias(kw("DISABLED"), $.disabled),
          seq(kw("ACCELERATOR"), field("accelerator", $.string_literal)),
        ),
      ),
    ),
  __submenu_submenu: ($) =>
    seq(
      kw("SUB-MENU"),
      field("name", $.identifier),
      optional(alias(kw("DISABLED"), $.disabled)),
      optional(seq(kw("LABEL"), field("label", $.string_literal))),
    ),
});
