module.exports = ({ kw }) => ({
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
      optional($.__create_widget_handle),
      optional($.assign_phrase),
      optional($.__create_widget_triggers),
    ),
  __create_widget_handle: ($) =>
    seq(field("handle", $.identifier), optional($.__create_in_widget_pool)),

  __create_widget_triggers: ($) =>
    seq(
      kw("TRIGGERS"),
      alias($._colon, ":"),
      repeat1($.__create_widget_trigger_definition),
      kw("END"),
      kw("TRIGGERS"),
    ),

  __create_widget_trigger_definition: ($) =>
    seq(
      kw("ON"),
      field("event", choice(kw("CHOOSE"), kw("ENTRY"), kw("LEAVE"), $.identifier)),
      $.do_statement,
    ),
});
