module.exports = ({ kw }) => ({
  use_statement: ($) =>
    seq(
      kw("USE"),
      field("environment", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
