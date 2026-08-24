export default ({ kw }) => ({
  delete_alias_statement: ($) => seq($.__delete_alias_prefix, $._no_error_terminator),

  __delete_alias_prefix: ($) => seq($._delete_keyword, kw("ALIAS"), field("alias", $._alias_name)),
});
