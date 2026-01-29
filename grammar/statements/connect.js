module.exports = ({ kw, tkw }) => ({
  connect_statement: ($) =>
    seq(
      tkw("CONNECT"),
      optional(
        field(
          "database",
          choice($.identifier, $.string_literal, $.function_call),
        ),
      ),
      repeat(alias($.__connect_option, $.connect_option)),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),

  __connect_database: ($) => choice($.__connect_option, $.string_literal),
  __connect_option: ($) =>
    seq(
      "-",
      field(
        "parameter",
        alias(token.immediate(/[\p{L}\p{N}_]+/u), $.identifier),
      ),
      optional(
        field(
          "value",
          choice($.identifier, $.string_literal, $.number_literal),
        ),
      ),
    ),
});
