module.exports = ({ kw, tkw }) => ({
  use_statement: ($) =>
    seq(
      kw("USE"),
      field("environment", $._expression),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
