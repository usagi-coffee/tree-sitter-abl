module.exports = ({ kw, tkw }) => ({
  menu_expression: ($) =>
    seq(
      kw("MENU"),
      field("menu", $.identifier),
      ":",
      field("attribute", $.identifier),
    ),
});
