module.exports = ({ kw }) => ({
  delete_alias_statement: ($) => seq($.__delete_alias_prefix, $._no_error_terminator),

  __delete_alias_prefix: ($) => seq(kw("DELETE"), kw("ALIAS"), field("alias", $._alias_name)),
});
