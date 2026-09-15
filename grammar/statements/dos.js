export default ({ kw }) => ({
  dos_statement: ($) => seq($.__dos_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __dos_prefix: ($) => seq(kw("DOS"), optional($._dos_unix_tail)),
});
