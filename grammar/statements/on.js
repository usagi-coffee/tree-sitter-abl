module.exports = ({ kw }) => ({
  on_statement: ($) =>
    prec.right(
      seq(
        kw("ON"),
        choice(
          // Database event: ON event OF database-object
          seq(
            field("event", $.__on_database_event),
            kw("OF"),
            field("object", $._identifier_or_qualified_name),
            optional(alias($.__on_referencing_phrase, $.referencing_phrase)),
            optional(alias(kw("OVERRIDE"), $.override)),
            choice(seq(kw("REVERT"), $._terminator), $._statement),
          ),
          // UI event: ON event-list [OF widget-list] [ANYWHERE]
          seq(
            $.__on_ui_event_widgets,
            repeat(seq(kw("OR"), $.__on_ui_event_widgets)),
            optional(alias(kw("ANYWHERE"), $.anywhere)),
            choice(
              seq(kw("REVERT"), $._terminator),
              $._statement,
              seq(
                kw("PERSISTENT"),
                kw("RUN"),
                field("procedure", $.identifier),
                optional($.arguments),
                $._terminator,
              ),
            ),
          ),
        ),
      ),
    ),

  __on_database_event: ($) =>
    choice(kw("CREATE"), kw("DELETE"), kw("FIND"), kw("WRITE"), kw("ASSIGN")),
  __on_ui_event: ($) => $._events,
  __on_ui_events: ($) =>
    seq(field("event", $.__on_ui_event), repeat(seq(",", field("event", $.__on_ui_event)))),
  __on_ui_event_widgets: ($) =>
    seq(
      $.__on_ui_events,
      optional(alias($.__on_of_phrase, $.of_phrase)),
    ),
  __on_of_phrase: ($) =>
    seq(
      kw("OF"),
      optional(field("of", kw("MENU-ITEM"))),
      field("widget", $.widget_phrase),
      repeat(
        seq(
          ",",
          optional(field("of", kw("MENU-ITEM"))),
          field("widget", $.widget_phrase),
        ),
      ),
    ),
  __on_referencing_phrase: ($) =>
    choice(
      seq(
        kw("NEW"),
        optional(kw("BUFFER")),
        field("new_record", $.identifier),
        kw("OLD"),
        optional(kw("BUFFER")),
        field("old_record", $.identifier),
      ),
      seq(kw("OLD"), optional(kw("VALUE")), field("old_field", $.identifier)),
    ),
});
