module.exports = ({ kw }) => ({
  use_statement: ($) => seq(kw("USE"), $.__use_body, $._no_error_terminator),

  __use_body: ($) => seq(field("environment", $._expression)),
});
