module.exports = ({ kw, tkw }) => ({
  display_statement: ($) =>
    seq(
      choice(kw("DISPLAY"), token(seq(/DISP(LAY)?/i, /\s+/))),
      $.__display_body,
      $._terminator,
    ),

  __display_body: ($) =>
    seq(
      optional(alias($.__display_stream_phrase, $.stream_phrase)),
      repeat1($._display_item),
      optional(seq(kw("IN"), tkw("WINDOW"), field("window", $._expression))),
      repeat(alias($.__display_frame_phrase, $.frame_phrase)),
      optional(tkw("NO-ERROR")),
    ),

  __display_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
  _display_item: ($) =>
    prec.right(
      seq(
        $._expression,
        optional(alias($.__display_format_phrase, $.format_phrase)),
        optional($.aggregate_phrase),
        optional(seq(tkw("WHEN"), field("when", $._expression))),
        optional(seq("@", field("base", choice($.identifier, $.qualified_name)))),
      ),
    ),

  __display_format_phrase: ($) =>
    alias($.__display_format_option, $.format_option),

  __display_format_option: ($) => seq(kw("FORMAT"), $.string_literal),

  __display_frame_phrase: ($) =>
    seq(
      kw("WITH"),
      repeat(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier)),
          tkw("NO-LABELS"),
          tkw("SIDE-LABELS"),
          tkw("CENTERED"),
          tkw("NO-BOX"),
          seq(kw("TITLE"), field("title", $._expression)),
          seq(kw("ROW"), field("row", $._expression)),
          seq(kw("COLUMN"), field("column", $._expression)),
          seq(optional($.number_literal), tkw("DOWN")),
          seq($.number_literal, tkw("COLUMN")),
          seq($.number_literal, tkw("COLUMNS")),
          tkw("OVERLAY"),
        ),
      ),
    ),
});
