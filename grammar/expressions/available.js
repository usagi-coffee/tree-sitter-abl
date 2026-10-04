export default ({ kw }) => ({
  available_expression: ($) =>
    seq($.__available_keyword, field("record", $._record_or_parenthesized_record)),
  __available_keyword: ($) => choice(kw("AVAIL"), kw("AVAILABLE")),
});
