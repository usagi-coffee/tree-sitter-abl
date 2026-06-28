module.exports = ({ kw }) => ({
  transaction_mode_statement: ($) => seq($.__transaction_mode_prefix, $._terminator),

  __transaction_mode_prefix: ($) => seq(kw("TRANSACTION-MODE"), $.__transaction_mode_body),
  __transaction_mode_body: ($) => seq(kw("AUTOMATIC"), optional(alias(kw("CHAINED"), $.chained))),
});
