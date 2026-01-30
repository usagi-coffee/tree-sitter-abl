module.exports = ({ kw, tkw }) => ({
  menu_item_expression: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("menu_item", $.identifier),
      ":",
      field("attribute", $.identifier),
    ),
  in_menu_expression: ($) =>
    seq(
      field("menu_item", $.menu_item_expression),
      kw("IN"),
      kw("MENU"),
      field("menu", $.identifier),
    ),
});
