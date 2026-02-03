module.exports = ({ kw }) => ({
  set_statement: ($) => seq(kw("SET"), $.__set_body, $._terminator),

  __set_body: ($) =>
    seq(
      optional($.__set_stream),
      optional(kw("UNLESS-HIDDEN")),
      choice($.__set_record_body, $.__set_fields_body),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __set_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),

  __set_fields_body: ($) =>
    seq(
      repeat1(alias($.__set_field, $.field)),
      optional(alias($.__set_go_on, $.go_on_phrase)),
      optional(alias($.__set_validate_option, $.validate_option)),
      optional(alias($.__set_help_phrase, $.help_phrase)),
      optional($.frame_phrase),
      optional($.editing_phrase),
    ),

  __set_field: ($) =>
    choice(
      prec.right(
        seq(
          field("field", $._identifier_or_qualified_name),
          optional($.format_phrase),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
      ),
      seq(
        field("field", $._identifier_or_qualified_name),
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
        alias($.__set_at_phrase, $.at_phrase),
      ),
      seq(kw("SKIP"), optional(seq("(", $._expression, ")"))),
      seq(kw("SPACE"), optional(seq("(", $._expression, ")"))),
      "^",
    ),

  __set_record_body: ($) =>
    seq(
      field("record", $.__set_record),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional($.frame_phrase),
    ),

  __set_record: ($) => $._identifier_or_qualified_name,

  __set_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __set_help_phrase: ($) => seq(kw("HELP"), $.string_literal),

  __set_go_on: ($) => seq(kw("GO-ON"), "(", repeat1($.identifier), ")"),
  __set_validate_option: ($) =>
    seq(
      kw("VALIDATE"),
      "(",
      field("condition", $._expression),
      ",",
      field("message", $._expression),
      ")",
    ),
});
