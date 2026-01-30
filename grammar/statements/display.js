module.exports = ({ kw, tkw }) => ({
  display_statement: ($) =>
    seq(
      choice(tkw("DISPLAY"), token(/DISP(LAY)?/i)),
      optional(alias($.__display_stream_phrase, $.stream_phrase)),
      repeat($.__display_item),
      optional(seq(kw("IN"), tkw("WINDOW"), field("window", $._expression))),
      repeat($.frame_phrase),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),

  __display_item: ($) =>
    seq(
      choice(
        $._expression,
        seq(
          field("field", choice($.identifier, $.qualified_name)),
          "(",
          repeat1($.aggregate_phrase),
          ")",
        ),
      ),
      optional(alias($.__display_format_phrase, $.format_phrase)),
      optional(seq(tkw("WHEN"), field("when", $._expression))),
      optional(seq("@", field("base", choice($.identifier, $.qualified_name)))),
    ),

  __display_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),

  __display_format_phrase: ($) =>
    alias($.__display_format_option, $.format_option),

  __display_format_option: ($) => seq(kw("FORMAT"), $.string_literal),
});
