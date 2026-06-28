module.exports = ({ kw }) => ({
  show_stats_statement: ($) => seq($.__show_stats_prefix, $._terminator),

  __show_stats_prefix: ($) => seq(kw("SHOW-STATS"), optional(alias(kw("CLEAR"), $.clear))),
});
