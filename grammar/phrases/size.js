export default ({ kw }) => ({
  size_phrase: ($) => seq($.__size_prefix, field("height", $._expression)),
  __size_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/shared-choice
      choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
      field("width", $._expression),
      $._by_keyword,
    ),
});
