module.exports = ({ kw }) => ({
  available_expression: ($) =>
    seq(choice(kw("AVAIL"), kw("AVAILABLE")), $.__available_expression_body),

  __available_expression_body: ($) => seq(field("record", $._record_or_parenthesized_record)),
});
