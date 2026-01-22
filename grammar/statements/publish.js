module.exports = ({ kw, tkw }) => ({
  publish_statement: ($) =>
    seq(
      tkw("PUBLISH"),
      field("event", $._expression),
      optional(seq(kw("FROM"), field("publisher", $._expression))),
      optional($.argument_list),
      $._terminator,
    ),
});
