module.exports = ({ kw }) => ({
  ambiguous_expression: ($) =>
    seq($.__ambiguous_prefix, field("record", $._record_or_parenthesized_record)),

  __ambiguous_prefix: ($) => kw("AMBIGUOUS"),
});
