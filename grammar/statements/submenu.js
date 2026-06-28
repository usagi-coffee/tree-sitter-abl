module.exports = ({ kw }) => ({
  submenu_definition: ($) =>
    seq($._define_private_prefix, kw("SUB-MENU"), $.__submenu_body, $._terminator),

  __submenu_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          $._color_font_option,
          alias(kw("SUB-MENU-HELP"), $.submenu_help),
          seq(kw("LIKE"), field("like", $.identifier)),
          alias($.__submenu_element, $.menu_element),
        ),
      ),
    ),
  __submenu_element: ($) =>
    choice(
      alias($._menu_item, $.menu_item),
      alias($._menu_submenu, $.submenu_item),
      alias(kw("RULE"), $.rule),
      alias(kw("SKIP"), $.skip),
    ),
});
