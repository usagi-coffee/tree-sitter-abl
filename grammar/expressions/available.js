export default ({ kw }) => ({
  available_expression: ($) =>
    seq($.__available_keyword, field("record", $._record_or_parenthesized_record)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __available_keyword: ($) => choice(kw("AVAIL"), kw("AVAILABLE")),
});
