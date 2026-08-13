export default ({ kw }) => ({
  set_size_statement: ($) => seq($.__set_size_prefix, $._terminator),

  __set_size_prefix: ($) =>
    seq(
      kw("SET-SIZE"),
      "(",
      field("buffer", $._identifier_or_qualified_name),
      ")",
      "=",
      field("size", $._expression),
    ),
});
