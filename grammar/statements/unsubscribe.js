export default ({ kw }) => ({
  unsubscribe_statement: ($) => seq($.__unsubscribe_prefix, $._terminator),

  __unsubscribe_prefix: ($) =>
    seq(
      kw("UNSUBSCRIBE"),
      optional(seq($._kw_procedure, field("subscriber", $._expression))),
      optional($._kw_to),
      $.__unsubscribe_event,
      optional(alias($.__unsubscribe_in_phrase, $.in_phrase)),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __unsubscribe_event: ($) =>
    choice(
      field("event", $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("ALL"), $.all),
    ),
  __unsubscribe_in_phrase: ($) => seq($._in_keyword, field("publisher", $._expression)),
});
