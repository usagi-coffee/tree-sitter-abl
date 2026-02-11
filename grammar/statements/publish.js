module.exports = ({ kw }) => ({
  publish_statement: ($) => seq(kw("PUBLISH"), $.__publish_body, $._terminator),
  __publish_body: ($) =>
    seq(
      field("event", $._expression),
      optional(alias($.__publish_from_phrase, $.from_phrase)),
      optional($.arguments),
    ),
  __publish_from_phrase: ($) =>
    seq(kw("FROM"), field("publisher", $._expression)),
});
