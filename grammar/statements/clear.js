module.exports = ({ kw, tkw }) => ({
  clear_statement: ($) =>
    seq(
      tkw("CLEAR"),
      optional(seq(kw("FRAME"), field("frame", $.identifier))),
      optional(tkw("ALL")),
      optional(tkw("NO-PAUSE")),
      $._terminator,
    ),
});
