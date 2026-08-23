export default ({ kw }) => ({
  widget_phrase: ($) =>
    choice(
      seq(kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      seq(kw("BROWSE"), field("browse", $.__widget_name)),
      $.__widget_handle,
      $.__widget_entry,
      seq(choice(kw("MENU"), kw("SUB-MENU")), field("menu", $.__widget_name)),
    ),

  __widget_name: ($) => choice($.identifier, $.preprocessor_name),

  __widget_handle: ($) =>
    seq(field("handle", choice($._identifier_or_qualified_name, $.preprocessor_name))),

  __widget_entry: ($) =>
    choice(
      seq(
        kw("FIELD"),
        field("field", $._identifier_or_array_access),
        optional(seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name))),
      ),
      seq(
        field("field", $._identifier_or_array_access),
        seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      ),
      seq(
        field("field", $.array_access),
        optional(seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name))),
      ),
      seq(
        field("column", $._identifier_or_array_access),
        seq($._in_keyword, kw("BROWSE"), field("browse", $.__widget_name)),
      ),
      seq(
        kw("MENU-ITEM"),
        field("item", $._identifier_or_qualified_name),
        optional(seq($._in_keyword, kw("MENU"), field("menu", $.__widget_name))),
      ),
      field("system_handle", alias($.__widget_system_handle, $.system_handle)),
    ),

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
