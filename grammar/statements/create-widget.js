export default ({ kw }) => ({
  create_widget_statement: ($) =>
    prec.right(seq(kw("CREATE"), $.__create_widget_body, $._terminator)),
  __create_widget_body: ($) =>
    seq(
      choice(
        kw("BUTTON"),
        kw("BROWSE"),
        kw("COMBO-BOX"),
        kw("CONTROL-FRAME"),
        kw("DIALOG-BOX"),
        kw("EDITOR"),
        kw("FILL-IN"),
        kw("FRAME"),
        kw("IMAGE"),
        kw("MENU"),
        kw("MENU-ITEM"),
        kw("RADIO-SET"),
        kw("RECTANGLE"),
        kw("SELECTION-LIST"),
        kw("SLIDER"),
        kw("SUB-MENU"),
        kw("TEXT"),
        kw("TOGGLE-BOX"),
        kw("WINDOW"),
        seq(kw("VALUE"), "(", field("widget_type", $._expression), ")"),
      ),
      optional($._handle_in_widget_pool),
      optional(alias($.__create_widget_assign_phrase, $.assign_phrase)),
      optional($.trigger_phrase),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __create_widget_assign_phrase: ($) => seq(kw("ASSIGN"), $._assign_pairs),

});
