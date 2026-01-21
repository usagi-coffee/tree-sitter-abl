module.exports = ({ op }) => ({
  new_expression: ($) =>
    seq(
      op("NEW"),
      field(
        "type",
        choice($.scoped_name, $.qualified_name, $.identifier, $.string_literal),
      ),
      $.argument_list,
    ),
});
