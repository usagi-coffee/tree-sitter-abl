module.exports = ({ kw, tkw }) => ({
  color_phrase: ($) =>
    choice(
      $.number_literal,
      $.string_literal,
      seq(tkw("VALUE"), "(", field("value", $._expression), ")"),
      seq(
        repeat1(
          choice(tkw("BLINK-"), tkw("BRIGHT-"), tkw("RVV-"), tkw("UNDERLINE-")),
        ),
        field("foreground", $.identifier),
      ),
      $.identifier,
    ),
});
