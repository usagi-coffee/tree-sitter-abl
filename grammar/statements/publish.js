module.exports = ({ kw }) => ({
  publish_statement: ($) => seq(kw("PUBLISH"), $.__publish_body, $._terminator),
  __publish_body: ($) =>
    seq(
      field("event", $._expression),
      optional(seq(kw("FROM"), field("publisher", $._expression))),
      optional($.arguments),
    ),
});
