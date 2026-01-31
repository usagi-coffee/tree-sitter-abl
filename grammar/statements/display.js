module.exports = ({ kw, tkw }) => ({
  display_statement: ($) =>
    seq(
      choice(tkw("DISPLAY"), token(/DISP(LAY)?/i)),
      optional(alias($.__display_stream_phrase, $.stream_phrase)),
      optional(tkw("UNLESS-HIDDEN")),
      choice($.__display_record_form, repeat($.__display_item)),
      optional(seq(kw("IN"), tkw("WINDOW"), field("window", $._expression))),
      repeat($.frame_phrase),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),

  __display_record_form: ($) =>
    seq(
      field("record", choice($.identifier, $.qualified_name)),
      kw("EXCEPT"),
      repeat1(field("except", choice($.identifier, $.qualified_name))),
    ),

  __display_item: ($) =>
    choice(
      alias($.__display_skip_phrase, $.skip_phrase),
      alias($.__display_space_phrase, $.space_phrase),
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
        optional($.format_phrase),
        optional(seq(tkw("WHEN"), field("when", $._expression))),
        optional(
          seq("@", field("base", choice($.identifier, $.qualified_name))),
        ),
      ),
    ),

  __display_skip_phrase: ($) =>
    choice(
      prec(1, seq(tkw("SKIP"), "(", optional($._expression), ")")),
      tkw("SKIP"),
    ),

  __display_space_phrase: ($) =>
    choice(
      prec(1, seq(tkw("SPACE"), "(", optional($._expression), ")")),
      tkw("SPACE"),
    ),

  __display_stream_phrase: ($) =>
    choice(
      seq(kw("STREAM"), field("stream", $.identifier)),
      seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
    ),
});
