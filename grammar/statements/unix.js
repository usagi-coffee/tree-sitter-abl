export default ({ kw }) => ({
  unix_statement: ($) => seq($.__unix_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __unix_prefix: ($) => seq(kw("UNIX"), optional($._dos_unix_tail)),
});
