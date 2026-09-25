export default ({ kw }) => ({
  delete_alias_statement: ($) => seq($.__delete_alias_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/shared-valued-fragment, tree-sitter-optimize/single-use-sequence
  __delete_alias_prefix: ($) => seq($._kw_delete, $._kw_alias, field("alias", $._alias_name)),
});
