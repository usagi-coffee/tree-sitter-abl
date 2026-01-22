module.exports = ({ kw, tkw }) => ({
  unload_statement: ($) =>
    seq(
      tkw("UNLOAD"),
      field("file", $._expression),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),
});
