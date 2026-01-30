module.exports = ({ kw, tkw }) => ({
  create_widget_statement: ($) =>
    prec.right(
      1,
      seq(
        kw("CREATE"),
        choice(
          kw("BUTTON"),
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
          seq(tkw("VALUE"), "(", field("widget_type", $._expression), ")"),
        ),
        field("handle", $.identifier),
        optional(seq(kw("IN"), kw("WIDGET-POOL"), field("pool", $.identifier))),
        optional($.__create_widget_assign),
        optional($.__create_widget_triggers),
        $._terminator,
      ),
    ),
  create_window_statement: ($) => $.create_widget_statement,
  __create_widget_assign: ($) =>
    seq(
      kw("ASSIGN"),
      repeat1(
        seq(
          field("attribute", $.identifier),
          "=",
          field("value", $._expression),
        ),
      ),
    ),
  __create_widget_triggers: ($) =>
    seq(
      kw("TRIGGERS"),
      $._colon,
      repeat1($.__create_widget_trigger_definition),
      tkw("END"),
      tkw("TRIGGERS"),
    ),
  __create_widget_trigger_definition: ($) =>
    seq(
      kw("ON"),
      field(
        "event",
        choice(tkw("CHOOSE"), tkw("ENTRY"), tkw("LEAVE"), $.identifier),
      ),
      $.do_block,
    ),
});
