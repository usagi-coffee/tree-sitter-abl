module.exports = ({ kw }) => ({
  system_help_statement: ($) => seq($.__system_help_prefix, $._no_error_terminator),

  __system_help_prefix: ($) => seq(kw("SYSTEM-HELP"), field("topic", $._expression)),
});
