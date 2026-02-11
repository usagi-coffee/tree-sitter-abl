module.exports = ({ kw }) => ({
  connect_statement: ($) =>
    seq(
      kw("CONNECT"),
      optional(
        field(
          "database",
          choice($.identifier, $.string_literal, $.function_call),
        ),
      ),
      repeat($.__connect_option),
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),

  __connect_option: ($) =>
    seq(
      "-",
      field(
        "parameter",
        alias(token.immediate(/[\p{L}\p{N}_]+/i), $.identifier),
      ),
      optional(
        field(
          "value",
          choice($.identifier, $.string_literal, $.number_literal),
        ),
      ),
    ),
});
