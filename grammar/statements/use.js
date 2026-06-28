module.exports = ({ kw }) => ({
  use_statement: ($) => seq($.__use_prefix, $._no_error_terminator),

  __use_prefix: ($) => seq(kw("USE"), $.__use_body),
  __use_body: ($) => seq(field("environment", $._expression)),
});
