module.exports = ({ kw }) => ({
  connect_statement: ($) => seq(kw("CONNECT"), optional($.__connect_tail), $._no_error_terminator),
  __connect_tail: ($) =>
    choice(
      seq(
        field("database", choice($.identifier, $.string_literal, $.function_call)),
        repeat($.__connect_option),
      ),
      repeat1($.__connect_option),
    ),

  __connect_option: ($) =>
    seq(
      "-",
      field("parameter", alias(token.immediate(/[\p{L}\p{N}_]+/i), $.identifier)),
      optional(field("value", choice($.identifier, $.string_literal, $.number_literal))),
    ),
});
