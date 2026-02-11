module.exports = ({ kw }) => ({
  show_stats_statement: ($) =>
    seq(kw("SHOW-STATS"), optional(alias(kw("CLEAR"), $.clear)), $._terminator),
});
