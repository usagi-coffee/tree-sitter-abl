export default ({ kw }) => ({
  page_statement: ($) => seq($.__page_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __page_prefix: ($) => seq(kw("PAGE"), optional($._stream_phrase)),
});
