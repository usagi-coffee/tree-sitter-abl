export default ({ kw }) => ({
  menu_definition: ($) => seq($.__menu_prefix, $._terminator),

  __menu_prefix: ($) =>
    seq($._define_keyword, optional($._definition_scope_modifier), kw("MENU"), $.__menu_body),

  __menu_body: ($) => seq(field("name", $.identifier), optional($.__menu_options)),
  __menu_options: ($) => prec.right(seq($.__menu_option, optional($.__menu_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __menu_option: ($) =>
    choice(
      $._color_font_option,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("TITLE"), field("title", $._expression)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._like_keyword, field("like", $.identifier)),
      alias(kw("MENUBAR"), $.menubar),
      $._aliased_menu_item,
      alias($._menu_submenu, $.submenu_item),
      alias(kw("RULE"), $.rule),
      alias(kw("SKIP"), $.skip),
    ),
});
