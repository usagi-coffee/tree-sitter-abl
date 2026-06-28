module.exports = ({ kw }) => ({
  locked_expression: ($) => seq(kw("LOCKED"), $.__locked_body),

  __locked_body: ($) => seq(field("record", $._record_or_parenthesized_record)),
});
