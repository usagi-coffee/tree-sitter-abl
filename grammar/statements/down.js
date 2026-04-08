module.exports = ({ kw }) => ({
  down_statement: ($) => seq(kw("DOWN"), optional($._up_down_tail), $._terminator),
});
