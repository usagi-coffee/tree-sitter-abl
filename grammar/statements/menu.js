const { definitionModifiers } = require("../helpers/modifiers");

module.exports = ({ kw }) => ({
  menu_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      ...definitionModifiers($, kw, {
        new: true,
        scope: ["SHARED"],
        access: ["PRIVATE"],
      }),
      kw("MENU"),
      $.__menu_body,
      $._terminator,
    ),

  __menu_body: ($) =>
    seq(
      field("name", $.identifier),
      repeat(
        choice(
          alias($.__menu_fgcolor, $.fgcolor),
          alias($.__menu_bgcolor, $.bgcolor),
          alias($.__menu_dcolor, $.dcolor),
          alias($.__menu_pfcolor, $.pfcolor),
          alias($.__menu_font, $.font),
          alias($.__menu_title, $.title),
          alias($.__menu_menubar, $.menubar),
          alias($.__menu_like, $.like_option),
          alias($.__menu_element, $.menu_element),
        ),
      ),
    ),

  __menu_fgcolor: ($) => seq(kw("FGCOLOR"), $._expression),
  __menu_bgcolor: ($) => seq(kw("BGCOLOR"), $._expression),
  __menu_dcolor: ($) => seq(kw("DCOLOR"), $._expression),
  __menu_pfcolor: ($) => seq(kw("PFCOLOR"), $._expression),
  __menu_font: ($) => seq(kw("FONT"), $._expression),
  __menu_title: ($) => seq(kw("TITLE"), $._expression),
  __menu_menubar: ($) => kw("MENUBAR"),
  __menu_like: ($) => seq(kw("LIKE"), field("like", $.identifier)),
  __menu_element: ($) =>
    choice(
      alias($.__menu_item, $.menu_item),
      alias($.__menu_submenu, $.submenu_item),
      alias($.__menu_rule, $.rule),
      alias($.__menu_skip, $.skip),
    ),
  __menu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("LABEL"), $.string_literal),
          kw("DISABLED"),
          seq(kw("ACCELERATOR"), $.string_literal),
        ),
      ),
    ),
  __menu_submenu: ($) =>
    seq(
      kw("SUB-MENU"),
      field("name", $.identifier),
      optional(kw("DISABLED")),
      optional(seq(kw("LABEL"), $.string_literal)),
    ),
  __menu_rule: ($) => kw("RULE"),
  __menu_skip: ($) => kw("SKIP"),
});
