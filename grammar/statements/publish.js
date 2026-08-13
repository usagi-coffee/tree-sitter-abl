export default ({ kw }) => ({
  publish_statement: ($) => seq($.__publish_prefix, $._terminator),
  __publish_prefix: ($) =>
    seq(
      kw("PUBLISH"),
      field("event", $._expression),
      optional(alias($.__publish_from_phrase, $.from_phrase)),
      optional($.arguments),
    ),
  __publish_from_phrase: ($) => seq(kw("FROM"), field("publisher", $._expression)),
});
