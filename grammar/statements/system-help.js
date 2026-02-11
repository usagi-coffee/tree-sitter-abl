module.exports = ({ kw }) => ({
  system_help_statement: ($) =>
    seq(
      kw("SYSTEM-HELP"),
      field("topic", $._expression),
      optional(alias(kw("NO-ERROR"), $.no_error)),
      $._terminator,
    ),
});
