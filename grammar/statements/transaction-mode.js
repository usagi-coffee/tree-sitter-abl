export default ({ kw }) => ({
  transaction_mode_statement: ($) => seq($.__transaction_mode_prefix, $._terminator),

  __transaction_mode_prefix: ($) =>
    seq(kw("TRANSACTION-MODE"), kw("AUTOMATIC"), optional(alias(kw("CHAINED"), $.chained))),
});
