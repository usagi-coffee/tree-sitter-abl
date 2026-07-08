module.exports = ({ kw }) => ({
  unload_statement: ($) => seq($.__unload_prefix, $._no_error_terminator),
  __unload_prefix: ($) => seq(kw("UNLOAD"), field("file", $._expression)),
});
