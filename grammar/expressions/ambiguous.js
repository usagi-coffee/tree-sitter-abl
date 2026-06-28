module.exports = ({ kw }) => ({
  ambiguous_expression: ($) =>
    seq(kw("AMBIGUOUS"), field("record", $._record_or_parenthesized_record)),
});
