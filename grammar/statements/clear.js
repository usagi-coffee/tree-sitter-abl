module.exports = ({ kw }) => ({
  clear_statement: ($) =>
    seq(
      kw("CLEAR"),
      optional(seq(kw("FRAME"), field("frame", $.identifier))),
      optional(alias(kw("ALL"), $.all)),
      optional(alias(kw("NO-PAUSE"), $.no_pause)),
      $._terminator,
    ),
});
