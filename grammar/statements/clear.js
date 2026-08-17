export default ({ kw }) => ({
  clear_statement: ($) => seq($.__clear_prefix, $._terminator),
  __clear_prefix: ($) =>
    seq(
      kw("CLEAR"),
      optional(seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier))),
      optional(alias(kw("ALL"), $.all)),
      optional(alias(kw("NO-PAUSE"), $.no_pause)),
    ),
});
