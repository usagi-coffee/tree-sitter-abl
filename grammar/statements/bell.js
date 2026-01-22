module.exports = ({ tkw }) => ({
  bell_statement: ($) => seq(tkw("BELL"), $._terminator),
});
