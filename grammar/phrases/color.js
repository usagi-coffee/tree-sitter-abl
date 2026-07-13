export default ({ kw }) => ({
  color_phrase: ($) =>
    choice(
      $.number_literal,
      $.string_literal,
      // Legacy foreground/background slash notation, e.g. white/red.
      prec(
        2,
        seq(
          field(
            "foreground",
            choice($.identifier, alias($.__color_prefixed_identifier, $.identifier)),
          ),
          "/",
          field("background", $.identifier),
        ),
      ),
      $._value_expression,
      field("foreground", alias($.__color_prefixed_identifier, $.identifier)),
      seq(
        repeat1(choice(kw("BLINK-"), kw("BRIGHT-"), kw("RVV-"), kw("UNDERLINE-"))),
        field("foreground", $.identifier),
      ),
      $.identifier,
    ),
  __color_prefixed_identifier: ($) =>
    token(/(BLINK-|BRIGHT-|RVV-|UNDERLINE-)[_\p{L}][\p{L}\p{N}_-]*/i),
});
