export default ({ kw }) => ({
  clear_statement: ($) => seq($.__clear_prefix, $._terminator),
  __clear_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_clear,
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence, tree-sitter-optimize/inline-keyword-owner
      optional(seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier))),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("ALL"), $.all)),
      optional(alias(kw("NO-PAUSE"), $.no_pause)),
    ),
});
