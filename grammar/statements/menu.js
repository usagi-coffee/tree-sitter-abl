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
          $._menu_color_font_option,
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
