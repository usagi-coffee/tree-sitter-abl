module.exports = ({ kw }) => ({
  transaction_mode_statement: ($) =>
    seq(
      kw("TRANSACTION-MODE"),
      kw("AUTOMATIC"),
      optional(kw("CHAINED")),
      $._terminator,
    ),
});
