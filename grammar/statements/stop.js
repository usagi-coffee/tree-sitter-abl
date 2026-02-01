module.exports = ({ kw }) => ({
  stop_statement: ($) => seq(kw("STOP"), $._terminator),
});
