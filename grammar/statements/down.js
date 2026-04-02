module.exports = ({ kw }) => ({
  down_statement: ($) => seq(kw("DOWN"), optional($.__up_down_tail), $._terminator),
});
