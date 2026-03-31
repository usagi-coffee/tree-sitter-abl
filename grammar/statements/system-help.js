module.exports = ({ kw }) => ({
  system_help_statement: ($) =>
    seq(kw("SYSTEM-HELP"), field("topic", $._expression), $._no_error_terminator),
});
