module.exports = ({ kw, tkw }) => ({
  finally_statement: ($) =>
    seq(
      tkw("FINALLY"),
      $.body,
      tkw("END"),
      optional(tkw("FINALLY")),
      $._terminator,
    ),
});
