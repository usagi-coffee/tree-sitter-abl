module.exports = ({ kw }) => ({
  menu_definition: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($.__menu_modifier),
      kw("MENU"),
      $.__menu_body,
      $._terminator,
    ),

  __menu_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
          seq(kw("DCOLOR"), field("dcolor", $._expression)),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          seq(kw("FONT"), field("font", $._expression)),
          seq(kw("TITLE"), field("title", $._expression)),
          seq(kw("LIKE"), field("like", $.identifier)),
          alias(kw("MENUBAR"), $.menubar),
          alias($._menu_item, $.menu_item),
          alias($._menu_submenu, $.submenu_item),
          alias(kw("RULE"), $.rule),
          alias(kw("SKIP"), $.skip),
        ),
      ),
    ),

  __menu_modifier: ($) =>
    choice(
      seq(alias(kw("NEW"), $.new_modifier), alias(kw("SHARED"), $.scope_modifier)),
      alias(kw("SHARED"), $.scope_modifier),
      alias(kw("PRIVATE"), $.access_modifier),
    ),
});
