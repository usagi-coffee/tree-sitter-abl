module.exports = ({ kw }) => ({
  clear_statement: ($) =>
    seq(
      kw("CLEAR"),
      optional(seq(kw("FRAME"), field("frame", $.identifier))),
      optional(kw("ALL")),
      optional(kw("NO-PAUSE")),
      $._terminator,
    ),
});
