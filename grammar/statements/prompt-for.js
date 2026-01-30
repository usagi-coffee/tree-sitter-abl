module.exports = ({ kw, tkw }) => ({
  prompt_for_statement: ($) =>
    seq(tkw("PROMPT-FOR"), $.__prompt_for_body, $._terminator),

  __prompt_for_body: ($) =>
    choice(
      prec.dynamic(1, $.__prompt_for_record_body),
      $.__prompt_for_fields_body,
    ),

  __prompt_for_record_body: ($) =>
    seq(
      optional(alias($.__prompt_for_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      field("record", $.identifier),
      optional(seq(tkw("EXCEPT"), repeat1(field("field", $.__prompt_for_field_target)))),
      optional(seq(kw("IN"), tkw("WINDOW"), field("window", $._expression))),
      optional(alias($.__prompt_for_frame_phrase, $.frame_phrase)),
    ),

  __prompt_for_fields_body: ($) =>
    seq(
      optional(alias($.__prompt_for_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__prompt_for_item, $.prompt_for_item)),
      optional(alias($.__prompt_for_go_on, $.go_on_phrase)),
      optional(seq(kw("IN"), tkw("WINDOW"), field("window", $._expression))),
      optional(alias($.__prompt_for_frame_phrase, $.frame_phrase)),
      optional(alias($.__prompt_for_editing_phrase, $.editing_phrase)),
    ),
  __prompt_for_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __prompt_for_item: ($) =>
    choice(
      prec.right(
        seq(
          field("field", $.__prompt_for_field_target),
          optional(alias($.__prompt_for_format_phrase, $.format_phrase)),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
      ),
      seq(
        tkw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        alias($.__prompt_for_format_phrase, $.format_phrase),
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
      tkw("SKIP"),
    ),
  __prompt_for_field_target: ($) => choice($.identifier, $.qualified_name),
  __prompt_for_format_phrase: ($) =>
    repeat1(
      choice(
        alias($.__prompt_for_format_option, $.format_option),
        alias($.__prompt_for_label_option, $.label_option),
      ),
    ),
  __prompt_for_format_option: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
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
    seq(tkw("VIEW-AS"), field("widget", $.identifier)),
  __prompt_for_fgcolor_option: ($) => seq(tkw("FGCOLOR"), $._expression),
  __prompt_for_bgcolor_option: ($) => seq(tkw("BGCOLOR"), $._expression),
  __prompt_for_font_option: ($) => seq(tkw("FONT"), $._expression),
  __prompt_for_editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
  __prompt_for_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __prompt_for_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      repeat(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier)),
          tkw("SIDE-LABELS"),
          tkw("NO-LABELS"),
          tkw("CENTERED"),
          seq(kw("ROW"), field("row", $._expression)),
          seq(kw("COLUMN"), field("column", $._expression)),
          tkw("OVERLAY"),
        ),
      ),
    ),
});
