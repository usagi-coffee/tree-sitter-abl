module.exports = ({ kw }) => ({
  set_byte_order_statement: ($) =>
    seq(kw("SET-BYTE-ORDER"), $.__set_byte_order_body, $._terminator),

  __set_byte_order_body: ($) =>
    seq(
      "(",
      field("buffer", $._expression),
      ")",
      "=",
      field("order", $.__set_byte_order_value),
    ),

  __set_byte_order_value: ($) => choice($.number_literal, $.identifier),
});
