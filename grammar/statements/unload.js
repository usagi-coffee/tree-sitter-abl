module.exports = ({ kw }) => ({
  unload_statement: ($) =>
    seq(
      kw("UNLOAD"),
      field("file", $._expression),
      optional(kw("NO-ERROR")),
      $._terminator,
    ),
});
