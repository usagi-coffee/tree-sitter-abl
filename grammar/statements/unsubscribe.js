module.exports = ({ kw }) => ({
  unsubscribe_statement: ($) =>
    seq(kw("UNSUBSCRIBE"), $.__unsubscribe_body, $._terminator),

  __unsubscribe_body: ($) =>
    seq(
      optional(
        seq(kw("PROCEDURE", { offset: 4 }), field("subscriber", $._expression)),
      ),
      optional(kw("TO")),
      choice(field("event", $._expression), alias(kw("ALL"), $.all)),
      optional(alias($.__unsubscribe_in_phrase, $.in_phrase)),
    ),
  __unsubscribe_in_phrase: ($) =>
    seq(kw("IN"), field("publisher", $._expression)),
});
