module.exports = ({ kw }) => ({
  update_statement: ($) => seq(kw("UPDATE"), $.__update_body, $._terminator),

  __update_body: ($) =>
    seq(
      choice($.__update_record_body, $.__update_fields_body),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __update_record_body: ($) =>
    prec(
      1,
      seq(
        field("record", choice($.identifier, $.qualified_name)),
        optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        optional($.frame_phrase),
      ),
    ),

  __update_fields_body: ($) =>
    seq(
      optional(kw("UNLESS-HIDDEN")),
      repeat1(alias($.__update_item, $.update_item)),
      optional(alias($.__update_go_on, $.go_on_phrase)),
      optional($.frame_phrase),
      optional($.editing_phrase),
    ),

  __update_item: ($) =>
    choice(
      prec.right(
        seq(
          field("field", $.__update_field_target),
          optional($.__update_field_phrase),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
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
            field("field", choice($.identifier, $.qualified_name)),
            optional($.__update_field_phrase),
          ),
        ),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        optional(alias($.__update_at_phrase, $.at_phrase)),
      ),
      seq(kw("SKIP"), optional(seq("(", $._expression, ")"))),
      seq(kw("SPACE"), optional(seq("(", $._expression, ")"))),
      "^",
    ),
  __update_field_target: ($) => choice($.identifier, $.qualified_name),
  __update_field_phrase: ($) =>
    repeat1(
      choice(
        $.format_phrase,
        alias($.__update_validate_option, $.validate_option),
      ),
    ),
  __update_validate_option: ($) =>
    seq(
      kw("VALIDATE"),
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
      ")",
    ),
  __update_at_phrase: ($) =>
    seq(choice(kw("AT"), kw("TO")), token(/[0-9]+(\.[0-9]+)?/)),

  __update_go_on: ($) => seq(kw("GO-ON"), "(", repeat1($.identifier), ")"),
});
