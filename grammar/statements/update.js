module.exports = ({ kw, tkw }) => ({
  update_statement: ($) => seq(tkw("UPDATE"), $.__update_body, $._terminator),

  __update_body: ($) =>
    choice(
      prec.dynamic(1, $.__update_record_body),
      $.__update_fields_body,
    ),
  __update_record_body: ($) =>
    seq(
      field("record", choice($.identifier, $.qualified_name)),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional($.frame_phrase),
      optional(tkw("NO-ERROR")),
    ),
  __update_fields_body: ($) =>
    seq(
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__update_item, $.update_item)),
      optional(alias($.__update_go_on, $.go_on_phrase)),
      optional($.frame_phrase),
      optional($.editing_phrase),
      optional(tkw("NO-ERROR")),
    ),
  __update_item: ($) =>
    choice(
      prec.right(
        seq(
          field("field", $.__update_field_target),
          optional(alias($.__update_format_phrase, $.format_phrase)),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
      ),
      seq(
        field("field", $.__update_field_target),
        "=",
        field("value", $._expression),
      ),
      seq(
        tkw("TEXT"),
        "(",
        repeat1(
          seq(
            field("field", choice($.identifier, $.qualified_name)),
            optional(alias($.__update_format_phrase, $.format_phrase)),
          ),
        ),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        optional(alias($.__update_at_phrase, $.at_phrase)),
      ),
      seq(tkw("SKIP"), optional(seq("(", $._expression, ")"))),
      seq(tkw("SPACE"), optional(seq("(", $._expression, ")"))),
      "^",
    ),
  __update_field_target: ($) => choice($.identifier, $.qualified_name),
  __update_format_phrase: ($) =>
    repeat1(
      choice(
        alias($.__update_format_option, $.format_option),
        alias($.__update_validate_option, $.validate_option),
      ),
    ),
  __update_format_option: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
      ),
    ),
  __update_validate_option: ($) =>
    seq(
      tkw("VALIDATE"),
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
      ")",
    ),
  __update_at_phrase: ($) =>
    seq(choice(kw("AT"), kw("TO")), token(/[0-9]+(\.[0-9]+)?/)),

  __update_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
});
