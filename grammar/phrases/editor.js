export default ({ kw }) => ({
  editor_phrase: ($) =>
    seq(kw("EDITOR"), optional($.__editor_options), $.__editor_size, optional($.__editor_options)),
  __editor_options: ($) => prec.right(seq($.__editor_option, optional($.__editor_options))),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __editor_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("BUFFER-CHARS"), field("buffer_chars", $.number_literal)),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("BUFFER-LINES"), field("buffer_lines", $.number_literal)),
      alias(kw("LARGE"), $.large),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(kw("MAX-CHARS"), field("max_chars", $.number_literal)),
      alias(kw("NO-BOX"), $.no_box),
      alias(kw("NO-WORD-WRAP"), $.no_word_wrap),
      $._scrollbar_option,
      $._tooltip_phrase,
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __editor_size: ($) =>
    choice(
      $.size_phrase,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
        kw("INNER-CHARS"),
        // oxlint-disable-next-line tree-sitter-optimize/shared-field-marker
        field("inner_chars", $.number_literal),
        // oxlint-disable-next-line tree-sitter-optimize/shared-valued-fragment
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
