module.exports = ({ kw }) => ({
  __go_on_phrase: ($) =>
    seq(
      kw("GO-ON"),
      "(",
      choice(
        $.identifier,
        $.string_literal,
        seq(
          choice($.identifier, $.string_literal),
          repeat(seq(optional(","), choice($.identifier, $.string_literal))),
        ),
      ),
      ")",
    ),
});
