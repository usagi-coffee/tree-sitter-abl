module.exports = ({ kw, tkw }) => ({
  apply_statement: ($) =>
    seq(
      tkw("APPLY"),
      field("event", $._expression),
      optional(seq(kw("TO"), field("widget", $._expression))),
      $._terminator,
    ),
});
