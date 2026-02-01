module.exports = ({ kw }) => ({
  show_stats_statement: ($) =>
    seq(kw("SHOW-STATS"), optional(kw("CLEAR")), $._terminator),
});
