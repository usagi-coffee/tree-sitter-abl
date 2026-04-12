module.exports = ({ kw }) => ({
  set_statement: ($) => seq(kw("SET"), $.__set_body, $._no_error_terminator),

  __set_body: ($) =>
    seq(
      optional($._stream_phrase),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      choice($.__set_record_body, $.__set_fields_body),
    ),

  __set_fields_body: ($) =>
    seq(repeat1(alias($.__set_field, $.field)), optional($.__set_fields_tail)),
  __set_fields_tail: ($) =>
    choice(
      seq(alias($._go_on_phrase, $.go_on_phrase), optional($.__set_fields_tail_after_go_on)),
      seq($._format_validate, optional($.__set_fields_tail_after_format_validate)),
      seq(kw("HELP"), field("help", $.string_literal), optional($.__set_fields_tail_after_help)),
      seq($.frame_phrase, optional($.editing_phrase)),
      $.editing_phrase,
    ),
  __set_fields_tail_after_go_on: ($) =>
    choice(
      seq($._format_validate, optional($.__set_fields_tail_after_format_validate)),
      seq(kw("HELP"), field("help", $.string_literal), optional($.__set_fields_tail_after_help)),
      seq($.frame_phrase, optional($.editing_phrase)),
      $.editing_phrase,
    ),
  __set_fields_tail_after_format_validate: ($) =>
    choice(
      seq(kw("HELP"), field("help", $.string_literal), optional($.__set_fields_tail_after_help)),
      seq($.frame_phrase, optional($.editing_phrase)),
      $.editing_phrase,
    ),
  __set_fields_tail_after_help: ($) =>
    choice(seq($.frame_phrase, optional($.editing_phrase)), $.editing_phrase),

  __set_field: ($) =>
    choice(
      alias($._skip_phrase, $.skip_phrase),
      alias($._space_phrase, $.space_phrase),
      prec.right(
        seq(
          field("field", $._identifier_or_qualified_name),
          optional($.format_phrase),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
      ),
      seq(field("field", $._identifier_or_qualified_name), "=", field("value", $._expression)),
      seq(field("field", $.array_access), "=", field("value", $._expression)),
      seq(
        kw("TEXT"),
        "(",
        repeat1(seq(field("field", $._identifier_or_qualified_name), optional($.format_phrase))),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        seq(kw("AT"), field("position", token(/[0-9]+(\.[0-9]+)?/))),
      ),
      "^",
    ),

  __set_record_body: ($) =>
    seq(field("record", $.__set_record), optional($._except_fields), optional($.frame_phrase)),

  __set_record: ($) => $._identifier_or_qualified_name,
});
