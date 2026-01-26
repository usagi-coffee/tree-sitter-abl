module.exports = ({ kw }) => ({
  new_expression: ($) =>
    seq(
      kw("NEW"),
      field(
        "type",
        choice($.scoped_name, $.qualified_name, $.identifier, $.string_literal),
      ),
      $.arguments,
    ),
});
