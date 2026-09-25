export default ({ kw }) => ({
  submenu_definition: ($) => seq($.__submenu_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __submenu_prefix: ($) => seq($._define_private_prefix, $._kw_sub_menu, $.__submenu_body),

  __submenu_body: ($) => seq(field("name", $.identifier), optional($.__submenu_options)),
  __submenu_options: ($) => prec.right(seq($.__submenu_option, optional($.__submenu_options))),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __submenu_option: ($) =>
    choice(
      $._color_font_option,
      alias(kw("SUB-MENU-HELP"), $.submenu_help),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._like_keyword, field("like", $.identifier)),
      alias($.__submenu_element, $.menu_element),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/choice-subset
  __submenu_element: ($) =>
    choice(
      $._aliased_menu_item,
      // oxlint-disable-next-line tree-sitter-optimize/shared-item-alias
      alias($._menu_submenu, $.submenu_item),
      alias(kw("RULE"), $.rule),
      alias($._kw_skip, $.skip),
    ),
});
