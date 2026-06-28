module.exports = ({ kw }) => ({
  down_statement: ($) => seq($.__down_prefix, $._terminator),

  __down_prefix: ($) => seq(kw("DOWN"), optional($._up_down_tail)),
});
