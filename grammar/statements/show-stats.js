export default ({ kw }) => ({
  show_stats_statement: ($) => seq($.__show_stats_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-alias-sequence
  __show_stats_prefix: ($) => seq(kw("SHOW-STATS"), optional(alias($._kw_clear, $.clear))),
});
