module.exports = ({ kw }) => ({
  connect_statement: ($) => seq($.__connect_prefix, $._no_error_terminator),
  __connect_prefix: ($) => seq(kw("CONNECT"), optional($.__connect_tail)),
  __connect_tail: ($) =>
    choice(
      seq(
        field("database", choice($.identifier, $.string_literal, $.function_call)),
        repeat(
          seq(
            "-",
            field("parameter", alias(token.immediate(/[\p{L}\p{N}_]+/i), $.identifier)),
            optional(field("value", choice($.identifier, $.string_literal, $.number_literal))),
          ),
        ),
      ),
      repeat1(
        seq(
          "-",
          field("parameter", alias(token.immediate(/[\p{L}\p{N}_]+/i), $.identifier)),
          optional(field("value", choice($.identifier, $.string_literal, $.number_literal))),
        ),
      ),
    ),
});
