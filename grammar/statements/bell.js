module.exports = ({ kw }) => ({
  bell_statement: ($) => seq(kw("BELL"), $._terminator),
});
