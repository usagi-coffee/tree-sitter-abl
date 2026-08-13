export default ({ kw }) => ({
  available_expression: ($) =>
    seq($.__available_prefix, field("record", $._record_or_parenthesized_record)),

  __available_prefix: ($) => choice(kw("AVAIL"), kw("AVAILABLE")),
});
