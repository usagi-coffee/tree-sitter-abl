module.exports = ({ kw, tkw }) => ({
  size_phrase: ($) =>
    seq(
      choice(kw("SIZE"), tkw("SIZE-CHARS"), tkw("SIZE-PIXELS")),
      field("width", $._expression),
      kw("BY"),
      field("height", $._expression),
    ),
});
