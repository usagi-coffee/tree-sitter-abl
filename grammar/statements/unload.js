module.exports = ({ kw }) => ({
  unload_statement: ($) => seq($.__unload_prefix, $._no_error_terminator),
  __unload_prefix: ($) => seq(kw("UNLOAD"), $.__unload_body),
  __unload_body: ($) => seq(field("file", $._expression)),
});
