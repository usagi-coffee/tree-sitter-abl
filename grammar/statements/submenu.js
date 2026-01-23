module.exports = ({ kw, tkw }) => ({
  submenu_definition: ($) =>
    seq(
      choice(kw("DEFINE"), kw("DEF")),
      optional(kw("PRIVATE")),
      tkw("SUB-MENU"),
      field("name", $.identifier),
      repeat(
        choice(
          alias($.__submenu_bgcolor, $.bgcolor),
          alias($.__submenu_dcolor, $.dcolor),
          alias($.__submenu_fgcolor, $.fgcolor),
          alias($.__submenu_pfcolor, $.pfcolor),
          alias($.__submenu_font, $.font),
          alias($.__submenu_help, $.submenu_help),
          alias($.__submenu_like, $.like_option),
          alias($.__submenu_element, $.menu_element),
        ),
      ),
      $._terminator,
    ),

  __submenu_bgcolor: ($) => seq(kw("BGCOLOR"), $._expression),
  __submenu_dcolor: ($) => seq(kw("DCOLOR"), $._expression),
  __submenu_fgcolor: ($) => seq(kw("FGCOLOR"), $._expression),
  __submenu_pfcolor: ($) => seq(kw("PFCOLOR"), $._expression),
  __submenu_font: ($) => seq(kw("FONT"), $._expression),
  __submenu_help: ($) => tkw("SUB-MENU-HELP"),
  __submenu_like: ($) => seq(kw("LIKE"), field("like", $.identifier)),
  __submenu_element: ($) =>
    choice(
      alias($.__submenu_item, $.menu_item),
      alias($.__submenu_submenu, $.submenu_item),
      alias($.__submenu_rule, $.rule),
      alias($.__submenu_skip, $.skip),
    ),
  __submenu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("LABEL"), $.string_literal),
          kw("DISABLED"),
          seq(kw("ACCELERATOR"), $.string_literal),
          // $.on_phrase, // TODO: add trigger support
        ),
      ),
    ),
  __submenu_submenu: ($) =>
    seq(
      tkw("SUB-MENU"),
      field("name", $.identifier),
      optional(kw("DISABLED")),
      optional(seq(kw("LABEL"), $.string_literal)),
    ),
  __submenu_rule: ($) => kw("RULE"),
  __submenu_skip: ($) => kw("SKIP"),
});
