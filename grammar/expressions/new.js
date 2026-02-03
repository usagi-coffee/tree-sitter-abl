module.exports = ({ kw }) => ({
  new_expression: ($) => seq(kw("NEW"), $.__new_expression_body),
  __new_expression_body: ($) =>
    seq(
      field(
        "type",
        choice($.scoped_name, $._identifier_or_qualified_name, $.string_literal),
      ),
      $.arguments,
    ),
});
