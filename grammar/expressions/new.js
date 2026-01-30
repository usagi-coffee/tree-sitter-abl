module.exports = ({ kw }) => ({
  new_expression: ($) => seq(kw("NEW"), $.__new_expression_body),
  __new_expression_body: ($) =>
    seq(
      field(
        "type",
        choice($.scoped_name, $.qualified_name, $.identifier, $.string_literal),
      ),
      $.arguments,
    ),
});
