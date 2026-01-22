module.exports = ({ tkw }) => ({
  stop_statement: ($) => seq(tkw("STOP"), $._terminator),
});
