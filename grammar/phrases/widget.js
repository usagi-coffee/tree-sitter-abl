export default ({ kw }) => ({
  widget_phrase: ($) =>
    choice(
      $._frame_browse_menu_widget,
      prec(
        "widget_handle",
        field(
          "handle",
          // oxlint-disable-next-line tree-sitter-optimize/shared-choice
          choice($._identifier_or_qualified_name, $.preprocessor_name),
        ),
      ),
      $.__widget_entry,
    ),

  // oxlint-disable-next-line tree-sitter-optimize/choice-subset, tree-sitter-optimize/shared-choice
  __widget_name: ($) => choice($.identifier, $.preprocessor_name),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __widget_entry: ($) =>
    choice(
      seq(
        kw("FIELD"),
        field("field", $._identifier_or_array_access),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        optional(seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name))),
      ),
      seq(
        field("field", $._identifier_or_array_access),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
        seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      ),
      seq(
        field("field", $.array_access),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
        optional(seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name))),
      ),
      seq(
        field("column", $._identifier_or_array_access),
        seq($._in_keyword, $._kw_browse, field("browse", $.__widget_name)),
      ),
      seq(
        $._kw_menu_item,
        field("item", $._identifier_or_qualified_name),
        optional(seq($._in_keyword, $._kw_menu, field("menu", $.__widget_name))),
      ),
      field("system_handle", alias($.__widget_system_handle, $.system_handle)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
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

  // VIEW/HIDE-only variant of widget_phrase: a bare name here can be followed
  // by IN WINDOW (not part of the entry/handle choice), which FRAME/BROWSE
  // cannot settle with one token of lookahead. Kept as its own symbols
  // (aliased back to widget_phrase) so the resulting GLR fork stays local to
  // VIEW/HIDE instead of reaching every widget_phrase call site.
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __view_hide_widget_phrase: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
      seq(kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq($._kw_browse, field("browse", $.__widget_name)),
      $.__view_hide_widget_ref,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/shared-choice
      seq(choice($._kw_menu, $._kw_sub_menu), field("menu", $.__widget_name)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/choice-subset
  __view_hide_widget_ref: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment, tree-sitter-optimize/inline-keyword-owner
        kw("FIELD"),
        field("field", $._identifier_or_array_access),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
        optional(seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name))),
      ),
      seq(
        field("field", $._identifier_or_array_access),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
        seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name)),
      ),
      seq(
        field("field", $.array_access),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
        optional(seq($._in_keyword, kw("FRAME", { offset: 4 }), field("frame", $.__widget_name))),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        field("column", $._identifier_or_array_access),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        seq($._in_keyword, $._kw_browse, field("browse", $.__widget_name)),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
        $._kw_menu_item,
        field("item", $._identifier_or_qualified_name),
        // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
        optional(seq($._in_keyword, $._kw_menu, field("menu", $.__widget_name))),
      ),
      field("system_handle", alias($.__widget_system_handle, $.system_handle)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      field("handle", choice($._identifier_or_qualified_name, $.preprocessor_name)),
    ),
});
