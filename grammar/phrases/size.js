export default ({ kw }) => ({
  size_phrase: ($) => seq($.__size_prefix, field("height", $._expression)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice-sequence
  __size_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice($._kw_size, $._kw_size_chars, $._kw_size_pixels),
      field("width", $._expression),
      $._by_keyword,
    ),
});
