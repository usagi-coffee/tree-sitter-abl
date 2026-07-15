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
      optional($.__create_widget_tail),
    ),
  __create_widget_tail: ($) =>
    choice(
      seq($._handle_in_widget_pool, optional($.__create_widget_assign_triggers_tail)),
      $.__create_widget_assign_triggers_tail,
    ),
  __create_widget_assign_triggers_tail: ($) =>
    choice(seq($.assign_phrase, optional($.__create_widget_triggers)), $.__create_widget_triggers),

  __create_widget_triggers: ($) =>
    seq(
      kw("TRIGGERS"),
      alias($._colon, ":"),
      repeat1(
        seq(
          kw("ON"),
          field("event", choice(kw("CHOOSE"), kw("ENTRY"), kw("LEAVE"), $.identifier)),
          $.do_statement,
        ),
      ),
      kw("END"),
      kw("TRIGGERS"),
    ),
});
