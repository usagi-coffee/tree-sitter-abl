module.exports = ({ tkw }) => ({
  set_byte_order_statement: ($) =>
    seq(
      tkw("SET-BYTE-ORDER"),
      "(",
      field("buffer", $._expression),
      ")",
      "=",
      field("order", $.__set_byte_order_value),
      $._terminator,
    ),

  __set_byte_order_value: ($) => choice($.number_literal, $.identifier),
});
