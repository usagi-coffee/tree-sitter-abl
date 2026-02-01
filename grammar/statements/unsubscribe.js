module.exports = ({ kw }) => ({
  unsubscribe_statement: ($) =>
    seq(kw("UNSUBSCRIBE"), $.__unsubscribe_body, $._terminator),

  __unsubscribe_body: ($) =>
    seq(
      optional(seq(kw("PROCEDURE"), field("subscriber", $._expression))),
      optional(kw("TO")),
      choice(field("event", $._expression), kw("ALL")),
      optional(seq(kw("IN"), field("publisher", $._expression))),
    ),
});
