module.exports = ({ tkw }) => ({
  set_size_statement: ($) =>
    seq(tkw("SET-SIZE"), $.__set_size_body, $._terminator),

  __set_size_body: ($) =>
    seq(
      "(",
      field("buffer", $._expression),
      ")",
      "=",
      field("size", $._expression),
    ),
});
