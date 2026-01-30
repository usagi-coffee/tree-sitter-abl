module.exports = ({ kw, tkw }) => ({
  menu_item_access: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("menu_item", $.identifier),
      ":",
      field("attribute", $.identifier),
      optional(seq(kw("IN"), kw("MENU"), field("menu", $.identifier))),
    ),
});
