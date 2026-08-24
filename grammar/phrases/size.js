export default ({ kw }) => ({
  size_phrase: ($) => seq($.__size_prefix, field("height", $._expression)),
  __size_prefix: ($) =>
    seq(
      choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
      field("width", $._expression),
      $._by_keyword,
    ),
});
