module.exports = ({ kw }) => ({
  up_statement: ($) => seq(kw("UP"), optional($._up_down_tail), $._terminator),
});
