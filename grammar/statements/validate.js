export default ({ kw }) => ({
  validate_statement: ($) => seq($.__validate_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __validate_prefix: ($) => seq($._kw_validate, field("record", $._identifier_or_qualified_name)),
});
