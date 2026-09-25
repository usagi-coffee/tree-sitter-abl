export default ({ kw }) => ({
  set_size_statement: ($) => seq($.__set_size_prefix, $._terminator),

  __set_size_prefix: ($) =>
    seq(
      kw("SET-SIZE"),
      "(",
      field("buffer", $._qualified_identifier),
      ")",
      "=",
      field("size", $._expression),
    ),
});
