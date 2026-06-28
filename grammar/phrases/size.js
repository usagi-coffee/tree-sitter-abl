module.exports = ({ kw }) => ({
  size_phrase: ($) => $._size_phrase,
  _size_phrase: ($) =>
    seq(
      choice(kw("SIZE"), kw("SIZE-CHARS"), kw("SIZE-PIXELS")),
      field("width", $._expression),
      kw("BY"),
      field("height", $._expression),
    ),
});
