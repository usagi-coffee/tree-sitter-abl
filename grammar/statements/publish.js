export default ({ kw }) => ({
  publish_statement: ($) => seq($.__publish_prefix, $._terminator),
  __publish_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("PUBLISH"),
      field("event", $._expression),
      optional(alias($.__publish_from_phrase, $.from_phrase)),
      optional($.arguments),
    ),
  __publish_from_phrase: ($) => seq($._kw_from, field("publisher", $._expression)),
});
