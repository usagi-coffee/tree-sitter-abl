module.exports = ({ kw }) => ({
  widget_phrase: ($) =>
    choice($.__widget_frame, $.__widget_handle, $.__widget_entry, $.__widget_menu),

  __widget_frame: ($) => seq(kw("FRAME"), field("frame", $.identifier)),

  __widget_handle: ($) =>
    seq(field("handle", $._identifier_or_qualified_name)),

  __widget_entry: ($) =>
    choice(
      seq(
        optional(kw("FIELD")),
        field("field", $._identifier_or_qualified_name),
        optional(seq(kw("IN"), kw("FRAME"), field("frame", $.identifier))),
      ),
      seq(
        field("column", $._identifier_or_qualified_name),
        seq(kw("IN"), kw("BROWSE"), field("browse", $.identifier)),
      ),
      seq(
        kw("MENU-ITEM"),
        field("item", $._identifier_or_qualified_name),
        optional($.__widget_in_menu),
      ),
      field("system_handle", alias($.__widget_system_handle, $.system_handle)),
    ),

  __widget_menu: ($) =>
    seq(choice(kw("MENU"), kw("SUB-MENU")), field("menu", $.identifier)),

  __widget_in_menu: ($) =>
    seq(kw("IN"), kw("MENU"), field("menu", $.identifier)),

  __widget_system_handle: ($) =>
    choice(
      kw("ACTIVE-WINDOW"),
      kw("CLIPBOARD"),
      kw("COLOR-TABLE"),
      kw("COMPILER"),
      kw("CURRENT-WINDOW"),
      kw("DEBUGGER"),
      kw("DEFAULT-WINDOW"),
      kw("ERROR-STATUS"),
      kw("FILE-INFO"),
      kw("FOCUS"),
      kw("FONT-TABLE"),
      kw("LAST-EVENT"),
      kw("RCODE-INFO"),
      kw("SELF"),
      kw("SESSION"),
      kw("SOURCE-PROCEDURE"),
      kw("TARGET-PROCEDURE"),
      kw("THIS-PROCEDURE"),
    ),
});
