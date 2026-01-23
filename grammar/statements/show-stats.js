module.exports = ({ tkw }) => ({
  show_stats_statement: ($) =>
    seq(tkw("SHOW-STATS"), optional(tkw("CLEAR")), $._terminator),
});
