module.exports = ({ kw, tkw }) => ({
  publish_statement: ($) =>
    seq(tkw("PUBLISH"), $.__publish_body, $._terminator),
  __publish_body: ($) =>
    seq(
      field("event", $._expression),
      optional(seq(kw("FROM"), field("publisher", $._expression))),
      optional($.arguments),
    ),
});
