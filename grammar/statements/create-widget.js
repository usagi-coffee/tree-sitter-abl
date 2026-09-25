export default ({ kw }) => ({
  create_widget_statement: ($) =>
    prec.right(seq(kw("CREATE"), $.__create_widget_body, $._terminator)),
  __create_widget_body: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      choice(
        kw("BUTTON"),
        $._kw_browse,
        kw("COMBO-BOX"),
        kw("CONTROL-FRAME"),
        kw("DIALOG-BOX"),
        kw("EDITOR"),
        kw("FILL-IN"),
        // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
        kw("FRAME", { offset: 4 }),
        kw("IMAGE"),
        kw("MENU"),
        kw("MENU-ITEM"),
        kw("RADIO-SET"),
        kw("RECTANGLE"),
        kw("SELECTION-LIST"),
        kw("SLIDER"),
        kw("SUB-MENU"),
        $._kw_text,
        kw("TOGGLE-BOX"),
        $._kw_window,
        seq($._kw_value, "(", field("widget_type", $._expression), ")"),
      ),
      optional($._handle_in_widget_pool),
      optional($.__no_error),
      optional(
        seq(
          choice(
            seq(
              alias($.__create_widget_assign_phrase, $.assign_phrase),
              optional($.trigger_phrase),
            ),
            $.trigger_phrase,
          ),
          optional($.__no_error),
        ),
      ),
    ),

  __create_widget_assign_phrase: ($) => seq(kw("ASSIGN"), $._assign_pair_list),
});
