module.exports = ({ kw }) => ({
  update_statement: ($) => seq(kw("UPDATE"), $.__update_body, $._terminator),

  __update_body: ($) =>
    seq(
      choice($.__update_record_body, $.__update_fields_body),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __update_record_body: ($) =>
    seq(
      field("record", $.__update_record),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional($.frame_phrase),
    ),

  __update_fields_body: ($) =>
    seq(
      optional(kw("UNLESS-HIDDEN")),
      repeat1(alias($.__update_field, $.field)),
      optional(alias($.__update_go_on, $.go_on_phrase)),
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
      seq(
        field("field", $.__update_field_target),
        "=",
        field("value", $._expression),
      ),
      seq(
        kw("TEXT"),
        "(",
        repeat1(
          seq(
            field("field", $._identifier_or_qualified_name),
            optional($.format_phrase),
          ),
        ),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        optional(alias($.__update_at_phrase, $.at_phrase)),
      ),
      "^",
    ),

  __update_record: ($) => $._identifier_or_qualified_name,
  __update_field_target: ($) =>
    choice(prec(1, $._identifier_or_qualified_name), $.array_access),
  __update_skip_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SKIP"), "(", $._expression, ")")),
      prec(-1, seq(kw("SKIP"))),
    ),
  __update_space_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SPACE"), "(", $._expression, ")")),
      prec(-1, seq(kw("SPACE"))),
    ),

  __update_at_phrase: ($) =>
    seq(choice(kw("AT"), kw("TO")), token(/[0-9]+(\.[0-9]+)?/)),

  __update_go_on: ($) =>
    seq(
      kw("GO-ON"),
      "(",
      choice(
        $.identifier,
        $.string_literal,
        seq(
          choice($.identifier, $.string_literal),
          repeat(seq(optional(","), choice($.identifier, $.string_literal))),
        ),
      ),
      ")",
    ),
});
