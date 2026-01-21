module.exports = ({ kw, tkw }) => ({
  on_statement: ($) =>
    prec.right(
      1,
      seq(
        kw("ON"),
        field("event", $.__on_database_event),
        kw("OF"),
        field("object", $.__on_database_object),
        optional(alias($.__on_referencing_phrase, $.referencing_phrase)),
        optional(alias($.__on_override, $.override)),
        choice(
          seq(tkw("REVERT"), $._terminator),
          $.do_block,
          $._statement,
        ),
      ),
    ),

  __on_database_event: ($) =>
    choice(kw("CREATE"), kw("DELETE"), kw("FIND"), kw("WRITE"), kw("ASSIGN")),
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
      seq(
        kw("OLD"),
        optional(kw("VALUE")),
        field("old_field", $.identifier),
      ),
    ),
});
