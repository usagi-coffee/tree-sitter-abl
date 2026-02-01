module.exports = ({ kw }) => ({
  prompt_for_statement: ($) =>
    seq(kw("PROMPT-FOR"), $.__prompt_for_body, $._terminator),

  __prompt_for_body: ($) =>
    seq(
      optional(alias($.__prompt_for_stream_phrase, $.stream_phrase)),
      optional(kw("UNLESS-HIDDEN")),
      choice($.__prompt_for_record_body, $.__prompt_for_fields_body),
    ),

  __prompt_for_record_body: ($) =>
    prec(
      1,
      seq(
        field("record", $.identifier),
        optional(
          seq(
            kw("EXCEPT"),
            repeat1(field("field", $.__prompt_for_field_target)),
          ),
        ),
        optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
        optional($.frame_phrase),
      ),
    ),

  __prompt_for_fields_body: ($) =>
    seq(
      repeat1(alias($.__prompt_for_field, $.field)),
      optional(alias($.__prompt_for_go_on, $.go_on_phrase)),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      optional($.frame_phrase),
      optional($.editing_phrase),
    ),

  __prompt_for_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),

  __prompt_for_field: ($) =>
    choice(
      seq(
        field("field", $.__prompt_for_field_target),
        optional($.__prompt_for_field_phrase),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        kw("TEXT"),
        "(",
        repeat1(
          seq(
            field("field", choice($.identifier, $.qualified_name)),
            optional($.__prompt_for_field_phrase),
          ),
        ),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        optional(
          choice(
            alias($.__prompt_for_at_phrase, $.at_phrase),
            alias($.__prompt_for_to_phrase, $.to_phrase),
          ),
        ),
        optional(alias($.__prompt_for_view_as_phrase, $.view_as_phrase)),
        optional(alias($.__prompt_for_fgcolor_option, $.fgcolor_option)),
        optional(alias($.__prompt_for_bgcolor_option, $.bgcolor_option)),
        optional(alias($.__prompt_for_font_option, $.font_option)),
      ),
      seq(kw("SKIP"), optional(seq("(", $._expression, ")"))),
      seq(kw("SPACE"), optional(seq("(", $._expression, ")"))),
      "^",
    ),

  __prompt_for_field_target: ($) => choice($.identifier, $.qualified_name),
  __prompt_for_field_phrase: ($) =>
    repeat1(
      choice(
        $.format_phrase,
        alias($.__prompt_for_label_option, $.label_option),
      ),
    ),
  __prompt_for_label_option: ($) =>
    seq(
      kw("LABEL"),
      choice($.string_literal, $.identifier),
      repeat(seq(",", choice($.string_literal, $.identifier))),
    ),
  __prompt_for_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __prompt_for_to_phrase: ($) => seq(kw("TO"), token(/[0-9]+(\.[0-9]+)?/)),
  __prompt_for_view_as_phrase: ($) =>
    seq(kw("VIEW-AS"), field("widget", $.identifier)),
  __prompt_for_fgcolor_option: ($) => seq(kw("FGCOLOR"), $._expression),
  __prompt_for_bgcolor_option: ($) => seq(kw("BGCOLOR"), $._expression),
  __prompt_for_font_option: ($) => seq(kw("FONT"), $._expression),

  __prompt_for_go_on: ($) => seq(kw("GO-ON"), "(", repeat1($.identifier), ")"),
});
