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
          seq(kw("FGCOLOR"), field("fgcolor", $._expression)),
          seq(kw("BGCOLOR"), field("bgcolor", $._expression)),
          seq(kw("DCOLOR"), field("dcolor", $._expression)),
          seq(kw("PFCOLOR"), field("pfcolor", $._expression)),
          seq(kw("FONT"), field("font", $._expression)),
          seq(kw("TITLE"), field("title", $._expression)),
          seq(kw("LIKE"), field("like", $.identifier)),
          alias(kw("MENUBAR"), $.menubar),
          alias($.__menu_item, $.menu_item),
          alias($.__menu_submenu, $.submenu_item),
          alias(kw("RULE"), $.rule),
          alias(kw("SKIP"), $.skip),
        ),
      ),
    ),

  __menu_item: ($) =>
    seq(
      kw("MENU-ITEM"),
      field("name", $.identifier),
      repeat(
        choice(
          seq(kw("LABEL"), field("label", $.string_literal)),
          kw("DISABLED"),
          seq(kw("ACCELERATOR"), field("accelerator", $.string_literal)),
        ),
      ),
    ),

  __menu_submenu: ($) =>
    seq(
      kw("SUB-MENU"),
      field("name", $.identifier),
      optional(kw("DISABLED")),
      optional(seq(kw("LABEL"), field("label", $.string_literal))),
    ),
});
