module.exports = ({ kw, tkw }) => ({
  unsubscribe_statement: ($) =>
    seq(tkw("UNSUBSCRIBE"), $.__unsubscribe_body, $._terminator),

  __unsubscribe_body: ($) =>
    seq(
      optional(seq(kw("PROCEDURE"), field("subscriber", $._expression))),
      optional(kw("TO")),
      choice(field("event", $._expression), tkw("ALL")),
      optional(seq(kw("IN"), field("publisher", $._expression))),
    ),
});
