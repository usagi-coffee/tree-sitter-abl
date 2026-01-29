module.exports = ({ kw, tkw }) => ({
  set_statement: ($) => seq(tkw("SET"), $.__set_body, $._terminator),

  __set_body: ($) =>
    seq(
      optional(alias($.__set_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__set_item, $.set_item)),
      optional(alias($.__set_go_on, $.go_on_phrase)),
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
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(/:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i),
      ),
    ),
  __set_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __set_editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
  __set_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __set_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      optional(seq(kw("FRAME"), field("frame", $.identifier))),
      repeat($.__set_frame_option),
    ),
  __set_frame_option: ($) => choice(tkw("NO-LABELS"), tkw("SIDE-LABELS")),
});
