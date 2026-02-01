module.exports = ({ kw }) => ({
  apply_statement: ($) => seq(kw("APPLY"), $.__apply_body, $._terminator),

  __apply_body: ($) =>
    seq(
      field("event", $._expression),
      optional(seq(kw("TO"), field("widget", $._expression))),
    ),
});
