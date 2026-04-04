module.exports = ({ kw }) => ({
  update_statement: ($) => seq(kw("UPDATE"), $.__update_body, $._no_error_terminator),

  __update_body: ($) => seq(choice($.__update_record_body, $.__update_fields_body)),

  __update_record_body: ($) =>
    seq(
      field("record", $.__update_record),
      optional($.__except_fields),
      optional($.frame_phrase),
    ),

  __update_fields_body: ($) =>
    seq(
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      repeat1(alias($.__update_field, $.field)),
      optional(alias($.__go_on_phrase, $.go_on_phrase)),
      optional($.frame_phrase),
      optional($.editing_phrase),
    ),

  __update_field: ($) =>
    choice(
      alias($.__update_skip_phrase, $.skip_phrase),
      alias($.__update_space_phrase, $.space_phrase),
      seq(
        field("field", $.__update_field_target),
        optional($.format_phrase),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(field("field", $.__update_field_target), "=", field("value", $._expression)),
      seq(
        kw("TEXT"),
        "(",
        repeat1(seq(field("field", $._identifier_or_qualified_name), optional($.format_phrase))),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        optional(seq(choice(kw("AT"), kw("TO")), field("position", token(/[0-9]+(\.[0-9]+)?/)))),
      ),
      "^",
    ),

  __update_record: ($) => $._identifier_or_qualified_name,
  __update_field_target: ($) => choice(prec(1, $._identifier_or_qualified_name), $.array_access),
  __update_skip_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SKIP"), "(", field("skip", $._expression), ")")),
      prec(-1, seq(kw("SKIP"))),
    ),
  __update_space_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SPACE"), "(", field("space", $._expression), ")")),
      prec(-1, seq(kw("SPACE"))),
    ),
});
