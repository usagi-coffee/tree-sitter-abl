module.exports = () => ({
  set_size_statement: ($) =>
    seq(
      token(/SET-SIZE/i),
      "(",
      field("buffer", $._expression),
      ")",
      "=",
      field("size", $._expression),
      $._terminator,
    ),
});
