module.exports = ({ kw }) => ({
  unload_statement: ($) => seq(kw("UNLOAD"), $.__unload_body, $._no_error_terminator),
  __unload_body: ($) => seq(field("file", $._expression)),
});
