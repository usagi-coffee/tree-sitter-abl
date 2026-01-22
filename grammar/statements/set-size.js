module.exports = ({ tkw }) => ({
  set_size_statement: ($) =>
    seq(
      tkw("SET-SIZE"),
      "(",
      field("buffer", $._expression),
      ")",
      "=",
      field("size", $._expression),
      $._terminator,
    ),
});
