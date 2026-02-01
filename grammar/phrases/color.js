module.exports = ({ kw }) => ({
  color_phrase: ($) =>
    choice(
      $.number_literal,
      $.string_literal,
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
      seq(
        repeat1(
          choice(kw("BLINK-"), kw("BRIGHT-"), kw("RVV-"), kw("UNDERLINE-")),
        ),
        field("foreground", $.identifier),
      ),
      $.identifier,
    ),
});
