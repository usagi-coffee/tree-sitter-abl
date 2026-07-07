module.exports = ({ kw }) => ({
  set_byte_order_statement: ($) => seq($.__set_byte_order_prefix, $._terminator),

  __set_byte_order_prefix: ($) => seq(kw("SET-BYTE-ORDER"), $.__set_byte_order_body),

  __set_byte_order_body: ($) =>
    seq(
      "(",
      field("buffer", $._expression),
      ")",
      "=",
      field("order", choice($.number_literal, $.identifier)),
    ),
});
