module.exports = ({ kw, tkw }) => ({
  prompt_for_statement: ($) =>
    seq(
      tkw("PROMPT-FOR"),
      optional(alias($.__prompt_for_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      repeat1(alias($.__prompt_for_item, $.prompt_for_item)),
      optional(alias($.__prompt_for_go_on, $.go_on_phrase)),
      optional(seq(kw("IN"), tkw("WINDOW"), field("window", $._expression))),
      optional(alias($.__prompt_for_frame_phrase, $.frame_phrase)),
      optional(alias($.__prompt_for_editing_phrase, $.editing_phrase)),
      $._terminator,
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
        alias($.__prompt_for_at_phrase, $.at_phrase),
      ),
      tkw("SKIP"),
    ),
  __prompt_for_field_target: ($) => choice($.identifier, $.qualified_name),
  __prompt_for_format_phrase: ($) =>
    seq(
      kw("FORMAT"),
      $._escaped_string,
      optional(
        token.immediate(
          /:(?:[RLCT](?:U)?(?:[0-9]+)?|U(?:[0-9]+)?|[0-9]+)/i,
        ),
      ),
    ),
  __prompt_for_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __prompt_for_editing_phrase: ($) =>
    seq(tkw("EDITING"), $._colon, repeat1($._statement), tkw("END")),
  __prompt_for_go_on: ($) => seq(tkw("GO-ON"), "(", repeat1($.identifier), ")"),
  __prompt_for_frame_phrase: ($) =>
    seq(kw("WITH"), optional(seq(kw("FRAME"), field("frame", $.identifier)))),
});
