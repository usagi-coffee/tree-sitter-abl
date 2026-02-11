module.exports = ({ kw }) => ({
  delete_alias_statement: ($) =>
    seq(kw("DELETE"), kw("ALIAS"), $.__delete_alias_body, $._terminator),

  __delete_alias_body: ($) =>
    seq(
      field("alias", $.__delete_alias_name),
      optional(kw("NO-ERROR")),
    ),

  __delete_alias_name: ($) =>
    choice(
      $.identifier,
      $.string_literal,
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
    ),
});
