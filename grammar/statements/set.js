module.exports = ({ kw }) => ({
  set_statement: ($) => seq(kw("SET"), $.__set_body, $._terminator),

  __set_body: ($) =>
    seq(
      optional($._stream_phrase),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      choice($.__set_record_body, $.__set_fields_body),
      optional(alias(kw("NO-ERROR"), $.no_error)),
    ),

  __set_fields_body: ($) =>
    seq(
      repeat1(alias($.__set_field, $.field)),
      optional(
        alias(
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
          $.go_on_phrase,
        ),
      ),
      optional(
        seq(
          kw("VALIDATE"),
          "(",
          field("condition", $._expression),
          ",",
          field("message", $._expression),
          ")",
        ),
      ),
      optional(seq(kw("HELP"), field("help", $.string_literal))),
      optional($.frame_phrase),
      optional($.editing_phrase),
    ),

  __set_field: ($) =>
    choice(
      alias($.__set_skip_phrase, $.skip_phrase),
      alias($.__set_space_phrase, $.space_phrase),
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
        field("field", $.array_access),
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
        seq(kw("AT"), field("position", token(/[0-9]+(\.[0-9]+)?/))),
      ),
      "^",
    ),

  __set_record_body: ($) =>
    seq(
      field("record", $.__set_record),
      optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
      optional($.frame_phrase),
    ),

  __set_record: ($) => $._identifier_or_qualified_name,
  __set_skip_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SKIP"), "(", field("skip", $._expression), ")")),
      prec(-1, seq(kw("SKIP"))),
    ),
  __set_space_phrase: ($) =>
    choice(
      prec.right(1, seq(kw("SPACE"), "(", field("space", $._expression), ")")),
      prec(-1, seq(kw("SPACE"))),
    ),
});
