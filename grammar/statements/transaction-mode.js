module.exports = ({ kw }) => ({
  transaction_mode_statement: ($) =>
    seq(kw("TRANSACTION-MODE"), $.__transaction_mode_body, $._terminator),

  __transaction_mode_body: ($) => seq(kw("AUTOMATIC"), optional(kw("CHAINED"))),
});
