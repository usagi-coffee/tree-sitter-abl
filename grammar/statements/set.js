module.exports = ({ kw, tkw }) => ({
  set_statement: ($) => seq(tkw("SET"), $.__set_body, $._terminator),

  __set_body: ($) =>
    seq(
      optional(alias($.__set_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__set_item, $.set_item)),
      optional(alias($.__set_go_on, $.go_on_phrase)),
      optional(alias($.__set_help_phrase, $.help_phrase)),
      optional(alias($.__set_frame_phrase, $.frame_phrase)),
      optional(alias($.__set_editing_phrase, $.editing_phrase)),
      optional(tkw("NO-ERROR")),
    ),
  __set_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  __set_item: ($) =>
    choice(
      prec.right(
        seq(
          field("field", $.__set_field_target),
          optional(alias($.__set_format_phrase, $.format_phrase)),
          optional(seq(kw("WHEN"), field("when", $._expression))),
        ),
      ),
      seq(
        field("field", $.__set_field_target),
        "=",
        field("value", $._expression),
      ),
      seq(
        tkw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        alias($.__set_format_phrase, $.format_phrase),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        alias($.__set_at_phrase, $.at_phrase),
      ),
      tkw("SKIP"),
    ),
  __set_field_target: ($) => choice($.identifier, $.qualified_name),
  __set_format_phrase: ($) =>
    repeat1(
      choice(
        alias($.__set_format_option, $.format_option),
        alias($.__set_label_option, $.label_option),
      ),
    ),
  __set_format_option: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
      ),
    ),
  __set_label_option: ($) => seq(kw("LABEL"), $._expression),
  __set_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __set_help_phrase: ($) => seq(kw("HELP"), $.string_literal),
  __set_editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
  __set_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __set_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      repeat(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier)),
          alias($.__set_frame_no_labels, $.frame_option),
          alias($.__set_frame_side_labels, $.frame_option),
          alias($.__set_frame_no_box, $.frame_option),
          alias($.__set_frame_centered, $.frame_option),
          alias($.__set_frame_title, $.frame_option),
          alias($.__set_frame_row, $.frame_option),
          alias($.__set_frame_column, $.frame_option),
          alias($.__set_frame_view_as, $.frame_option),
        ),
      ),
    ),
  __set_frame_no_labels: ($) => tkw("NO-LABELS"),
  __set_frame_side_labels: ($) => tkw("SIDE-LABELS"),
  __set_frame_no_box: ($) => tkw("NO-BOX"),
  __set_frame_centered: ($) => tkw("CENTERED"),
  __set_frame_title: ($) => seq(kw("TITLE"), field("title", $._expression)),
  __set_frame_row: ($) => seq(kw("ROW"), field("row", $._expression)),
  __set_frame_column: ($) => seq(kw("COLUMN"), field("column", $._expression)),
  __set_frame_view_as: ($) => seq(kw("VIEW-AS"), tkw("DIALOG-BOX")),
});
