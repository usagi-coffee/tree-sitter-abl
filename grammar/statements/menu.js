export default ({ kw }) => ({
  menu_definition: ($) => seq($.__menu_prefix, $._terminator),

  __menu_prefix: ($) =>
    seq(
      kw("DEFINE", { offset: 3 }),
      optional($._definition_scope_modifier),
      kw("MENU"),
      $.__menu_body,
    ),

  __menu_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          $._color_font_option,
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
});
