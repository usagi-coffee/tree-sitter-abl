module.exports = ({ kw, tkw }) => ({
  transaction_mode_statement: ($) =>
    seq(
      kw("TRANSACTION-MODE"),
      tkw("AUTOMATIC"),
      optional(tkw("CHAINED")),
      $._terminator,
    ),
});
