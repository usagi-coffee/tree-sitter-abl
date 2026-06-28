module.exports = ({ kw }) => ({
  set_size_statement: ($) => seq($.__set_size_prefix, $._terminator),

  __set_size_prefix: ($) => seq(kw("SET-SIZE"), $.__set_size_body),
  __set_size_body: ($) =>
    seq(
      "(",
      field("buffer", $._identifier_or_qualified_name),
      ")",
      "=",
      field("size", $._expression),
    ),
});
