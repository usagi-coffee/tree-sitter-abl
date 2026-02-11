module.exports = ({ kw }) => ({
  editor_phrase: ($) =>
    seq(
      kw("EDITOR"),
      choice(
        $.size_phrase,
        seq(
          kw("INNER-CHARS"),
          field("inner_chars", $.number_literal),
          kw("INNER-LINES"),
          field("inner_lines", $.number_literal),
        ),
      ),
      optional($.__editor_options),
    ),

  __editor_options: ($) =>
    repeat1(
      choice(
        seq(kw("BUFFER-CHARS"), field("buffer_chars", $.number_literal)),
        seq(kw("BUFFER-LINES"), field("buffer_lines", $.number_literal)),
        alias(kw("LARGE"), $.large),
        seq(kw("MAX-CHARS"), field("max_chars", $.number_literal)),
        alias(kw("NO-BOX"), $.no_box),
        alias(kw("NO-WORD-WRAP"), $.no_word_wrap),
        alias(kw("SCROLLBAR-HORIZONTAL"), $.scrollbar_horizontal),
        alias(kw("SCROLLBAR-VERTICAL"), $.scrollbar_vertical),
        seq(kw("TOOLTIP"), field("tooltip", $._expression)),
      ),
    ),
});
