module.exports = ({ kw }) => ({
  system_help_statement: ($) =>
    seq(
      kw("SYSTEM-HELP"),
      field("topic", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
