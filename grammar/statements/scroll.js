export default ({ kw }) => ({
  scroll_statement: ($) => seq($.__scroll_prefix, $._terminator),
  __scroll_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("SCROLL"),
      optional(alias(kw("FROM-CURRENT"), $.from_current)),
      optional($.__scroll_direction),
      optional($.frame_phrase),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __scroll_direction: ($) => choice(alias(kw("UP"), $.up), alias($._kw_down, $.down)),
});
