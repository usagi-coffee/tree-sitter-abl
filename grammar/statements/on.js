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
            field("object", $.__on_database_object),
            optional(alias($.__on_referencing_phrase, $.referencing_phrase)),
            optional(alias($.__on_override, $.override)),
            choice(seq(kw("REVERT"), $._terminator), $._statement),
          ),
          // UI event: ON event-list [OF widget-list] [ANYWHERE]
          seq(
            field("event", $.__on_ui_event),
            optional(
              seq(
                kw("OF"),
                optional(kw("MENU-ITEM")),
                field("widget", $.widget_phrase),
                repeat(
                  seq(
                    ",",
                    optional(kw("MENU-ITEM")),
                    field("widget", $.widget_phrase),
                  ),
                ),
              ),
            ),
            optional(kw("ANYWHERE")),
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
  __on_ui_event: ($) => $.identifier,
  __on_database_object: ($) => choice($.qualified_name, $.identifier),
  __on_override: ($) => kw("OVERRIDE"),
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
