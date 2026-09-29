export default ({ kw }) => ({
  clear_statement: ($) => seq($.__clear_prefix, $._terminator),
  __clear_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      $._kw_clear,
      optional($._frame_identifier_phrase),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("ALL"), $.all)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("NO-PAUSE"), $.no_pause)),
    ),
});
