module.exports = ({ kw }) => ({
  color_phrase: ($) =>
    choice(
      $.number_literal,
      $.string_literal,
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
      field("foreground", alias($.__color_prefixed_identifier, $.identifier)),
      seq(
        repeat1(
          choice(kw("BLINK-"), kw("BRIGHT-"), kw("RVV-"), kw("UNDERLINE-")),
        ),
        field("foreground", $.identifier),
      ),
      $.identifier,
    ),
  __color_prefixed_identifier: ($) =>
    token(/(BLINK-|BRIGHT-|RVV-|UNDERLINE-)[_\p{L}][\p{L}\p{N}_-]*/i),
});
