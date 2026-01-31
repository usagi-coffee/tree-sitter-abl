module.exports = ({ kw, tkw }) => ({
  apply_statement: ($) => seq(tkw("APPLY"), $.__apply_body, $._terminator),

  __apply_body: ($) =>
    seq(
      field("event", $._expression),
      optional(seq(tkw("TO"), field("widget", $._expression))),
    ),
});
