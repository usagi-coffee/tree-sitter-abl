module.exports = ({ kw }) => ({
  ambiguous_expression: ($) => seq(kw("AMBIGUOUS"), $.__ambiguous_expression_body),

  __ambiguous_expression_body: ($) => seq(field("record", $._record_or_parenthesized_record)),
});
