export default ({ kw }) => ({
  editor_phrase: ($) =>
    seq(kw("EDITOR"), optional($.__editor_options), $.__editor_size, optional($.__editor_options)),
  __editor_options: ($) => prec.right(seq($.__editor_option, optional($.__editor_options))),
  __editor_option: ($) =>
    choice(
      seq(kw("BUFFER-CHARS"), field("buffer_chars", $.number_literal)),
      seq(kw("BUFFER-LINES"), field("buffer_lines", $.number_literal)),
      alias(kw("LARGE"), $.large),
      seq(kw("MAX-CHARS"), field("max_chars", $.number_literal)),
      alias(kw("NO-BOX"), $.no_box),
      alias(kw("NO-WORD-WRAP"), $.no_word_wrap),
      $._scrollbar_option,
      $._tooltip_phrase,
    ),
  __editor_size: ($) =>
    choice(
      $.size_phrase,
      seq(
        kw("INNER-CHARS"),
        field("inner_chars", $.number_literal),
        kw("INNER-LINES"),
        field("inner_lines", $.number_literal),
      ),
      seq(
        kw("INNER-LINES"),
        field("inner_lines", $.number_literal),
        kw("INNER-CHARS"),
        field("inner_chars", $.number_literal),
      ),
    ),
});
