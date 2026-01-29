module.exports = ({ kw, tkw }) => ({
  subscribe_statement: ($) =>
    seq(tkw("SUBSCRIBE"), $.__subscribe_body, $._terminator),

  __subscribe_body: ($) =>
    seq(
      optional(seq(kw("PROCEDURE"), field("subscriber", $._expression))),
      optional(kw("TO")),
      field("event", $._expression),
      choice(seq(kw("IN"), field("publisher", $._expression)), tkw("ANYWHERE")),
      optional(seq(kw("RUN-PROCEDURE"), field("procedure", $._expression))),
      optional(tkw("NO-ERROR")),
    ),
});
