export default ({ kw }) => ({
  widget_phrase: ($) =>
    choice(
      seq(kw("FRAME"), field("frame", $.__widget_name)),
      seq(kw("BROWSE"), field("browse", $.__widget_name)),
      $.__widget_handle,
      $.__widget_entry,
      seq(choice(kw("MENU"), kw("SUB-MENU")), field("menu", $.__widget_name)),
    ),

  // Generated screens reach their widgets through a macro — `OF FRAME
  // {&FRAME-NAME}`, `IN BROWSE {&BROWSE-NAME}` — so a name here can be either.
  __widget_name: ($) => choice($.identifier, $.preprocessor_name),

  __widget_handle: ($) =>
    seq(field("handle", choice($._identifier_or_qualified_name, $.preprocessor_name))),

  // A bare name is a handle -- see the precedence that settles it against this
  // rule. So neither field branch may also match a bare name: either FIELD
  // introduces it, or IN FRAME qualifies it. With both parts optional the
  // branch overlapped __widget_handle, the precedence took the handle, and
  // `HIDE TBADR IN FRAME FR1` lost its IN clause.
  __widget_entry: ($) =>
    choice(
      seq(
        kw("FIELD"),
        field("field", $._identifier_or_array_access),
        optional(seq(kw("IN"), kw("FRAME"), field("frame", $.__widget_name))),
      ),
      seq(
        field("field", $._identifier_or_array_access),
        seq(kw("IN"), kw("FRAME"), field("frame", $.__widget_name)),
      ),
      seq(
        field("column", $._identifier_or_array_access),
        seq(kw("IN"), kw("BROWSE"), field("browse", $.__widget_name)),
      ),
      seq(
        kw("MENU-ITEM"),
        field("item", $._identifier_or_qualified_name),
        optional(seq(kw("IN"), kw("MENU"), field("menu", $.__widget_name))),
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
