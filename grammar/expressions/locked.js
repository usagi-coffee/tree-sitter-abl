export default ({ kw }) => ({
  locked_expression: ($) =>
    seq($.__locked_prefix, field("record", $._record_or_parenthesized_record)),

  __locked_prefix: ($) => kw("LOCKED"),
});
