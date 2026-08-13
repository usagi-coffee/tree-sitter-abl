export default ({ kw }) => ({
  validate_statement: ($) => seq($.__validate_prefix, $._no_error_terminator),

  __validate_prefix: ($) => seq(kw("VALIDATE"), field("record", $._identifier_or_qualified_name)),
});
