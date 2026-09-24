export default ({ kw }) => ({
  clear_statement: ($) => seq($.__clear_prefix, $._terminator),
  __clear_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("CLEAR"),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
      optional(seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier))),
      optional(alias(kw("ALL"), $.all)),
      optional(alias(kw("NO-PAUSE"), $.no_pause)),
    ),
});
