export default ({ kw }) => ({
  locked_expression: ($) => seq(kw("LOCKED"), field("record", $._record_or_parenthesized_record)),
});
