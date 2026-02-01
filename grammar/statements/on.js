module.exports = ({ kw }) => ({
  on_statement: ($) =>
    prec.right(
      1,
      choice(
        // Database event: ON event OF database-object
        seq(
          kw("ON"),
          field("event", $.__on_database_event),
          kw("OF"),
          field("object", $.__on_database_object),
          optional(alias($.__on_referencing_phrase, $.referencing_phrase)),
          optional(alias($.__on_override, $.override)),
          choice(seq(kw("REVERT"), $._terminator), $.do_block, $._statement),
        ),
        // UI event: ON event-list [OF widget-list] [ANYWHERE]
        seq(
          kw("ON"),
          field("event", $.__on_ui_event),
          optional(
            seq(
              kw("OF"),
              optional(kw("MENU-ITEM")),
              field("widget", $.__on_widget),
              repeat(
                seq(
                  ",",
                  optional(kw("MENU-ITEM")),
                  field("widget", $.__on_widget),
                ),
              ),
              optional(alias($.__on_in_frame, $.in_frame_phrase)),
            ),
          ),
          optional(kw("ANYWHERE")),
          choice(
            seq(kw("REVERT"), $._terminator),
            $.do_block,
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

  __on_database_event: ($) =>
    choice(kw("CREATE"), kw("DELETE"), kw("FIND"), kw("WRITE"), kw("ASSIGN")),
  __on_ui_event: ($) => $.identifier,
  __on_widget: ($) => choice($.identifier, $.qualified_name),
  __on_database_object: ($) => choice($.qualified_name, $.identifier),
  __on_override: ($) => kw("OVERRIDE"),
  __on_in_frame: ($) =>
    seq(kw("IN"), kw("FRAME"), field("frame", $.identifier)),
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
